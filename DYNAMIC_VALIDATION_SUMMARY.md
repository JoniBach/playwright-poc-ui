# Dynamic Zod Schema Validation for Journey API

**Created:** November 19, 2025  
**Status:** Implemented (needs TypeScript fixes)

---

## Question Answered

**Q: Do we currently have a Zod schema capable of validating the API POST endpoint content?**

**A: Yes and No.**

- ✅ **YES** - We have component schemas that validate journey JSON structure
- ❌ **NO** - We did NOT have runtime validators for actual POST data
- ✅ **NOW YES** - Created dynamic schema generator that creates validators from journey JSON

---

## What Was Created

### 1. **Dynamic Schema Generator** (`journey-data-validator.ts`)

A utility that **generates Zod schemas at runtime** from journey JSON configuration.

**Key Functions:**

```typescript
// Generate schema for a single component
generateComponentSchema(component: Component): z.ZodTypeAny

// Generate schema for an entire page
generatePageSchema(components: Component[]): z.ZodObject<any>

// Generate schema for entire journey
generateJourneySchema(journey: any): z.ZodObject<any>

// Validate page data
validatePageData(components, data): { success, errors? }

// Validate journey data
validateJourneyData(journey, data): { success, errors? }

// Validate specific page
validateSpecificPage(journey, pageId, data): { success, errors? }
```

---

## How It Works

### Step 1: Journey JSON Defines Validation

```json
{
  "type": "textInput",
  "id": "email-address",
  "props": {
    "name": "email-address",
    "label": "Email address"
  },
  "validation": {
    "required": true,
    "pattern": "email",
    "maxLength": 255,
    "errorMessages": {
      "required": "Enter your email address",
      "pattern": "Enter an email address in the correct format",
      "maxLength": "Email must be 255 characters or less"
    }
  }
}
```

### Step 2: Dynamic Schema Generated

```typescript
// At runtime, generates:
z.object({
  'email-address': z.string()
    .min(1, 'Enter your email address')
    .max(255, 'Email must be 255 characters or less')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter an email address in the correct format')
})
```

### Step 3: Server Validates POST Data

```typescript
// In +server.ts
const journey = await loadJourney('register-a-plane');
const validation = validateSpecificPage(journey, 'contact-details', formData);

if (!validation.success) {
  return json({ errors: validation.errors }, { status: 400 });
}
```

---

## Supported Validation Rules

### Required Fields
```json
{
  "validation": {
    "required": true,
    "errorMessages": {
      "required": "This field is required"
    }
  }
}
```

### Length Validation
```json
{
  "validation": {
    "minLength": 2,
    "maxLength": 100,
    "errorMessages": {
      "minLength": "Must be at least 2 characters",
      "maxLength": "Must be 100 characters or less"
    }
  }
}
```

### Pattern Validation
```json
{
  "validation": {
    "pattern": "email",  // or "phone", "postcode", "url", "ni-number"
    "errorMessages": {
      "pattern": "Enter an email address in the correct format"
    }
  }
}
```

**Supported Patterns:**
- `email` - Email address format
- `phone` - Phone number format  
- `postcode` - UK postcode format
- `url` - URL format
- `ni-number` - National Insurance number

### Custom Pattern
```json
{
  "validation": {
    "customPattern": "^[A-Z]{3}\\d{4}$",
    "errorMessages": {
      "pattern": "Must be 3 letters followed by 4 numbers"
    }
  }
}
```

### Component-Specific Validation

**Radios/Select:**
```typescript
// Automatically validates against valid options
// If items are ["individual", "organisation"]
// Schema: z.enum(["individual", "organisation"])
```

**Checkboxes:**
```typescript
// Validates array of selected values
// Schema: z.array(z.enum(["option1", "option2"]))
```

**Date Input:**
```typescript
// Accepts either ISO string or object format
// Schema: z.union([
//   z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
//   z.object({ day, month, year })
// ])
```

---

## Integration with Server Endpoint

### Current Implementation (Manual)

```typescript
// +server.ts - OLD WAY
function validateFormData(data, journey, currentPage) {
  const errors = [];
  
  // Manual validation logic...
  if (!data['email-address']) {
    errors.push({ field: 'email-address', message: 'Required' });
  }
  
  return errors;
}
```

### New Implementation (Dynamic)

```typescript
// +server.ts - NEW WAY
import { validateSpecificPage } from '$lib/validation/journey-data-validator';

const validation = validateSpecificPage(journey, currentPage, formData);

if (!validation.success) {
  return json({ errors: validation.errors }, { status: 400 });
}
```

---

## Benefits

### 1. **Single Source of Truth**
- Validation rules defined once in journey JSON
- Used by both UI and server
- No drift between frontend and backend validation

### 2. **Type Safety**
- Zod provides runtime type checking
- TypeScript types inferred from schemas
- Catches validation errors at runtime

### 3. **Automatic Validation**
- Add validation to journey JSON
- Server automatically validates
- No code changes needed

### 4. **Consistent Error Messages**
- Error messages defined in journey JSON
- Same messages shown in UI and returned from API
- Easy to update in one place

### 5. **Testable**
- Tests can verify server validates according to journey config
- Can test validation rules independently
- Easy to add new validation rules

---

## Example Usage

### In Server Endpoint

```typescript
import { validateSpecificPage } from '$lib/validation/journey-data-validator';
import { journeys } from '$lib/data/journeys';

export const POST: RequestHandler = async ({ params, request }) => {
  const journey = journeys.find(j => j.id === params.slug);
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const currentPage = formData.get('_currentPage');
  
  // Validate using dynamic schema
  const validation = validateSpecificPage(journey, currentPage, data);
  
  if (!validation.success) {
    return json({ 
      success: false, 
      errors: validation.errors 
    }, { status: 400 });
  }
  
  // Continue with valid data...
};
```

### In Tests

```typescript
test('should validate email format', async ({ request }) => {
  const response = await request.post('/api/journey', {
    data: {
      'email-address': 'not-an-email'
    }
  });
  
  const data = await response.json();
  expect(data.success).toBe(false);
  expect(data.errors).toContainEqual({
    field: 'email-address',
    message: 'Enter an email address in the correct format'
  });
});
```

---

## Current Status

### ✅ Implemented
- Dynamic schema generator
- Component validation logic
- Page validation
- Journey validation
- Error formatting

### ⚠️ Needs Work
- TypeScript type fixes (validation property not in Component type)
- Integration with server endpoint (replace manual validation)
- Journey data loader fixes (import paths)

### 📋 TODO
1. **Fix TypeScript errors** - Add validation property to Component types
2. **Update server endpoint** - Replace `validateFormData` with `validateSpecificPage`
3. **Add validation to journey JSONs** - Start with `register-a-plane.json`
4. **Test validation** - Write tests for validation logic
5. **Document patterns** - Add more validation patterns as needed

---

## Next Steps

### Immediate (to make it work):

1. **Add validation property to Component schema:**
```typescript
// In component.schema.ts
const BaseComponentProps = z.object({
  id: z.string().optional(),
  classes: z.string().optional(),
  validation: z.object({
    required: z.boolean().optional(),
    minLength: z.number().optional(),
    maxLength: z.number().optional(),
    pattern: z.string().optional(),
    customPattern: z.string().optional(),
    errorMessages: z.record(z.string()).optional()
  }).optional()
});
```

2. **Fix server endpoint imports:**
```typescript
// Create proper journey loader or use existing one
import { loadJourney } from '$lib/loaders/journey-loader';
```

3. **Replace validation function:**
```typescript
// Replace validateFormData with validateSpecificPage
import { validateSpecificPage } from '$lib/validation/journey-data-validator';
```

4. **Add validation to one journey JSON** (proof of concept)

---

## Benefits for Testing

This directly addresses the test strategy review findings:

✅ **Server validates same rules as UI** - Single source of truth  
✅ **Tests can verify error messages** - Error messages from journey JSON  
✅ **Automated test generation** - Can generate tests from validation rules  
✅ **Data-driven testing** - Test data and validation rules in JSON  
✅ **Consistent validation** - No drift between UI and server

---

## Conclusion

**YES**, we now have a Zod schema system capable of validating API POST endpoint content!

The system **dynamically generates** Zod schemas from journey JSON configuration, providing:
- Runtime validation
- Type safety
- Single source of truth
- Automatic error messages
- Full testability

**Next:** Fix TypeScript errors and integrate with server endpoint to make it fully functional.
