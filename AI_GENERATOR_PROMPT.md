# AI Journey Generator - Complete Prompt Template

**Purpose:** Generate working GOV.UK journeys with validation, proper page IDs, and API compatibility.

**Date:** November 19, 2025

---

## 🎯 Complete AI Prompt Template

Use this exact prompt when generating journeys with AI:

```
You are a GOV.UK journey designer. Create a complete, working journey JSON file for [JOURNEY PURPOSE].

CRITICAL REQUIREMENTS:

1. **Page ID Naming Convention:**
   - Use kebab-case for all page IDs (e.g., "applicant-details", "check-your-answers")
   - The check your answers page MUST be named "check-your-answers" (not "check-answers")
   - The completion page should be named "confirmation" or "completion"

2. **Required Journey Properties:**
   - id: string (kebab-case, e.g., "passport-apply")
   - name: string (human-readable, e.g., "Apply for a passport")
   - landingPage: object with title, lead, sections
   - startPage: string (first page ID after landing)
   - checkYourAnswersPage: "check-your-answers" (MUST be this exact value)
   - completionPage: "confirmation"
   - pages: object with all page definitions

3. **Validation Rules for ALL Input Fields:**
   Every textInput, email, tel, textarea, radios, checkboxes, select, and dateInput component MUST have:
   
   ```json
   "validation": {
     "required": true,  // or false
     "minLength": number,  // for text fields
     "maxLength": number,  // for text fields
     "pattern": "email" | "phone" | "postcode" | "url" | "ni-number",  // for pattern validation
     "errorMessages": {
       "required": "Enter [field name]",
       "pattern": "Enter [field name] in the correct format, like [example]",
       "minLength": "[Field name] must be at least [N] characters",
       "maxLength": "[Field name] must be [N] characters or less"
     }
   }
   ```

4. **Error Message Style (GOV.UK Guidelines):**
   - Start with imperative verb: "Enter", "Select", "Choose"
   - Be specific and helpful
   - Include examples where appropriate
   - Use plain English
   - Example: "Enter an email address in the correct format, like name@example.com"

5. **Component Requirements:**
   - Every input component MUST have: id, props.id, props.name, props.label
   - Use consistent naming: id = props.id = props.name (kebab-case)
   - Add helpful hints where appropriate
   - Use appropriate autocomplete attributes

6. **Page Structure:**
   - Every page MUST have: id, title, components
   - Set nextPage and previousPage for navigation
   - The last content page should have nextPage: "check-your-answers"
   - check-your-answers page should have nextPage: "confirmation"

7. **Check Your Answers Page:**
   MUST be structured exactly like this:
   ```json
   "check-your-answers": {
     "id": "check-your-answers",
     "title": "Check your answers",
     "components": [
       {
         "type": "heading",
         "id": "cya-heading",
         "props": {
           "text": "Check your answers before submitting",
           "size": "l"
         }
       }
     ],
     "nextPage": "confirmation",
     "previousPage": "[last-content-page]"
   }
   ```

8. **Confirmation Page:**
   ```json
   "confirmation": {
     "id": "confirmation",
     "title": "Application submitted",
     "components": [
       {
         "type": "insetText",
         "id": "confirmation-inset",
         "props": {
           "text": "We have received your application. Your reference number is [REFERENCE]."
         }
       },
       {
         "type": "paragraph",
         "id": "what-next",
         "props": {
           "text": "We will email you within [N] working days with the outcome."
         }
       }
     ],
     "previousPage": "check-your-answers"
   }
   ```

VALIDATION EXAMPLES BY FIELD TYPE:

**Text Input:**
```json
{
  "type": "textInput",
  "id": "full-name",
  "props": {
    "id": "full-name",
    "name": "full-name",
    "label": "Full name",
    "hint": "Enter your name as it appears on official documents",
    "type": "text",
    "autocomplete": "name",
    "width": "20"
  },
  "validation": {
    "required": true,
    "minLength": 2,
    "maxLength": 100,
    "errorMessages": {
      "required": "Enter your full name",
      "minLength": "Full name must be at least 2 characters",
      "maxLength": "Full name must be 100 characters or less"
    }
  }
}
```

**Email Input:**
```json
{
  "type": "textInput",
  "id": "email-address",
  "props": {
    "id": "email-address",
    "name": "email-address",
    "label": "Email address",
    "hint": "We will send your confirmation to this email",
    "type": "email",
    "autocomplete": "email",
    "width": "20"
  },
  "validation": {
    "required": true,
    "pattern": "email",
    "maxLength": 255,
    "errorMessages": {
      "required": "Enter your email address",
      "pattern": "Enter an email address in the correct format, like name@example.com",
      "maxLength": "Email address must be 255 characters or less"
    }
  }
}
```

**Phone Input:**
```json
{
  "type": "textInput",
  "id": "telephone-number",
  "props": {
    "id": "telephone-number",
    "name": "telephone-number",
    "label": "Telephone number",
    "hint": "Include the country code if outside the UK",
    "type": "tel",
    "autocomplete": "tel",
    "width": "20"
  },
  "validation": {
    "required": true,
    "pattern": "phone",
    "minLength": 10,
    "maxLength": 20,
    "errorMessages": {
      "required": "Enter a telephone number",
      "pattern": "Enter a telephone number, like 01632 960 001 or +44 808 157 0192",
      "minLength": "Telephone number must be at least 10 characters",
      "maxLength": "Telephone number must be 20 characters or less"
    }
  }
}
```

**Radios (Required):**
```json
{
  "type": "radios",
  "id": "applicant-type",
  "props": {
    "id": "applicant-type",
    "name": "applicant-type",
    "legend": "Who is applying?",
    "items": [
      {"value": "individual", "text": "An individual"},
      {"value": "organisation", "text": "A company or organisation"}
    ]
  },
  "validation": {
    "required": true,
    "errorMessages": {
      "required": "Select who is applying"
    }
  }
}
```

Now generate the complete journey JSON for: [JOURNEY PURPOSE]
```

---

## 🔍 Validation Checklist

After AI generates a journey, validate it against this checklist:

### **Critical Requirements** ✅

- [ ] `checkYourAnswersPage` property is set to `"check-your-answers"`
- [ ] `completionPage` property is set to `"confirmation"`
- [ ] A page with id `"check-your-answers"` exists in `pages`
- [ ] A page with id `"confirmation"` exists in `pages`
- [ ] All page IDs use kebab-case (no camelCase, no spaces)

### **Validation Rules** ✅

- [ ] Every textInput has `validation` property
- [ ] Every email field has `pattern: "email"`
- [ ] Every phone field has `pattern: "phone"`
- [ ] Every required field has `required: true`
- [ ] All error messages start with imperative verbs
- [ ] All error messages include helpful examples

### **Component Structure** ✅

- [ ] Every component has unique `id`
- [ ] Every input component has `props.id`, `props.name`, `props.label`
- [ ] Component IDs match props.id and props.name
- [ ] All IDs use kebab-case

### **Page Navigation** ✅

- [ ] Every page (except first) has `previousPage`
- [ ] Every page (except last) has `nextPage`
- [ ] Last content page has `nextPage: "check-your-answers"`
- [ ] check-your-answers has `nextPage: "confirmation"`

### **Landing Page** ✅

- [ ] Has `title` and `lead`
- [ ] Has `sections` array with content
- [ ] Includes "What you can do" section
- [ ] Includes "Who can use this service" section

---

## 🤖 Automated Validation Script

Create this script to validate AI-generated journeys:

```typescript
// validate-journey.ts
import { readFileSync } from 'fs';
import { JourneySchema } from './src/lib/schemas/journey.schema';

function validateJourney(filePath: string) {
  const content = readFileSync(filePath, 'utf-8');
  const journey = JSON.parse(content);
  
  const errors: string[] = [];
  
  // Check critical properties
  if (!journey.checkYourAnswersPage) {
    errors.push('Missing checkYourAnswersPage property');
  } else if (journey.checkYourAnswersPage !== 'check-your-answers') {
    errors.push(`checkYourAnswersPage should be "check-your-answers", got "${journey.checkYourAnswersPage}"`);
  }
  
  if (!journey.completionPage) {
    errors.push('Missing completionPage property');
  }
  
  // Check pages exist
  if (!journey.pages['check-your-answers']) {
    errors.push('Missing check-your-answers page in pages object');
  }
  
  if (!journey.pages[journey.completionPage]) {
    errors.push(`Missing ${journey.completionPage} page in pages object`);
  }
  
  // Check validation on input components
  for (const [pageId, page] of Object.entries(journey.pages)) {
    for (const component of (page as any).components || []) {
      const inputTypes = ['textInput', 'email', 'tel', 'textarea', 'radios', 'checkboxes', 'select', 'dateInput'];
      
      if (inputTypes.includes(component.type)) {
        if (!component.validation) {
          errors.push(`Component ${component.id} on page ${pageId} missing validation`);
        } else {
          if (!component.validation.errorMessages) {
            errors.push(`Component ${component.id} on page ${pageId} missing errorMessages`);
          }
        }
      }
    }
  }
  
  // Validate with Zod schema
  try {
    JourneySchema.parse(journey);
  } catch (error: any) {
    errors.push(`Zod validation failed: ${error.message}`);
  }
  
  if (errors.length === 0) {
    console.log('✅ Journey validation passed!');
    return true;
  } else {
    console.log('❌ Journey validation failed:');
    errors.forEach(err => console.log(`  - ${err}`));
    return false;
  }
}

// Usage:
validateJourney('./static/journeys/my-new-journey.json');
```

---

## 📋 Post-Generation Steps

After AI generates a journey:

1. **Save the JSON** to `static/journeys/[journey-id].json`

2. **Run validation script:**
   ```bash
   npx tsx validate-journey.ts ./static/journeys/[journey-id].json
   ```

3. **Add to journey index:**
   ```json
   // static/journeys/index.json
   {
     "journeys": [
       {
         "id": "[journey-id]",
         "name": "[Journey Name]",
         "departmentSlug": "[department]",
         "slug": "[journey-id]",
         "enabled": true
       }
     ]
   }
   ```

4. **Test the journey:**
   ```
   http://localhost:5174/[department]/[journey-id]/apply
   ```

5. **Test validation:**
   - Leave fields empty → Should see "Enter [field]" errors
   - Enter invalid email → Should see "Enter an email address in the correct format"
   - Submit valid data → Should see confirmation with reference number

---

## 🎯 Example: Complete Working Journey

See `static/journeys/register-a-plane.json` for a complete example with:
- ✅ Correct page ID naming
- ✅ Validation on all input fields
- ✅ GOV.UK-style error messages
- ✅ Proper navigation flow
- ✅ Working API integration

---

## 🚀 Quick Start

To generate a new journey with AI:

1. **Copy the complete prompt template** from above
2. **Replace [JOURNEY PURPOSE]** with your journey (e.g., "Apply for a driving licence")
3. **Send to OpenAI** with structured output using JourneySchema
4. **Validate the output** using the checklist
5. **Test the journey** in the browser
6. **Fix any issues** and regenerate if needed

---

## ⚠️ Common Mistakes to Avoid

1. ❌ Using `"check-answers"` instead of `"check-your-answers"`
2. ❌ Missing validation on input components
3. ❌ Error messages that don't start with imperative verbs
4. ❌ Using camelCase for page IDs instead of kebab-case
5. ❌ Missing `checkYourAnswersPage` or `completionPage` properties
6. ❌ Inconsistent component IDs (id ≠ props.id ≠ props.name)

---

## ✅ Success Criteria

A journey is ready for production when:

- ✅ Passes Zod schema validation
- ✅ All input components have validation rules
- ✅ All error messages follow GOV.UK guidelines
- ✅ Check your answers page displays correctly
- ✅ Server API validates and returns helpful errors
- ✅ Successful submission generates reference number
- ✅ Journey can be completed end-to-end without errors

---

**Use this template for ALL future journey generation to ensure consistency and API compatibility!**
