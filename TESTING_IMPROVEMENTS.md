# UI Prototype Generator Improvements for Better Testing

**Document Purpose:** Recommendations for enhancing the journey JSON schema to enable comprehensive automated testing.

**Date:** November 19, 2025

---

## Executive Summary

The current journey JSON system is well-structured but lacks **test-specific metadata** needed for comprehensive automated testing. Key gaps:

1. ❌ No validation rules defined
2. ❌ No error messages specified  
3. ❌ No test data/fixtures
4. ❌ No accessibility metadata
5. ❌ No test IDs

---

## Proposed Schema Enhancements

### 1. Validation Rules Schema

```typescript
export const ValidationRuleSchema = z.object({
  required: z.boolean().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  pattern: z.enum(['email', 'phone', 'postcode', 'url']).optional(),
  customPattern: z.string().optional(),
  
  errorMessages: z.object({
    required: z.string().optional(),
    minLength: z.string().optional(),
    maxLength: z.string().optional(),
    pattern: z.string().optional()
  }).optional()
});
```

**Usage:**
```json
{
  "type": "textInput",
  "id": "email-address",
  "validation": {
    "required": true,
    "pattern": "email",
    "errorMessages": {
      "required": "Enter your email address",
      "pattern": "Enter an email address in the correct format"
    }
  }
}
```

### 2. Test Data Schema

```typescript
export const TestDataSchema = z.object({
  valid: z.record(z.any()).optional(),
  invalid: z.record(z.object({
    value: z.any(),
    expectedError: z.string()
  })).optional()
});
```

**Usage:**
```json
{
  "testData": {
    "valid": {
      "email-address": "test@example.com",
      "full-name": "John Smith"
    },
    "invalid": {
      "email-address": {
        "value": "not-an-email",
        "expectedError": "Enter an email address in the correct format"
      }
    }
  }
}
```

### 3. Accessibility Metadata Schema

```typescript
export const AccessibilityMetadataSchema = z.object({
  ariaLabel: z.string().optional(),
  ariaDescribedBy: z.string().optional(),
  ariaRequired: z.boolean().optional(),
  focusOnError: z.boolean().optional()
});
```

**Usage:**
```json
{
  "accessibility": {
    "ariaLabel": "Email address",
    "ariaRequired": true,
    "focusOnError": true
  }
}
```

### 4. Test ID Schema

```typescript
// Add to all components
{
  "testId": z.string().optional()
}
```

**Usage:**
```json
{
  "type": "textInput",
  "id": "email-address",
  "testId": "input-email"
}
```

---

## Benefits for Testing

### 1. Automated Test Generation
Generate tests directly from journey JSON:

```typescript
export function generateValidationTests(journey: Journey) {
  const tests = [];
  for (const component of journey.components) {
    if (component.validation?.required) {
      tests.push({
        name: `should show error when ${component.id} is empty`,
        expectedError: component.validation.errorMessages.required
      });
    }
  }
  return tests;
}
```

### 2. Data-Driven Testing
Use test data from JSON:

```typescript
test('should validate email', async ({ page }) => {
  const journey = await loadJourney('register-a-plane');
  const testData = journey.testData.invalid['email-address'];
  
  await page.fill('#email-address', testData.value);
  await expect(page.getByText(testData.expectedError)).toBeVisible();
});
```

### 3. Consistent Error Messages
Single source of truth:

```typescript
// UI uses error from JSON
renderError(component.validation.errorMessages.required);

// Test verifies error from JSON
await expect(page.getByText(component.validation.errorMessages.required))
  .toBeVisible();
```

---

## Implementation Roadmap

### Phase 1: Validation Rules (Week 1) - HIGH PRIORITY
1. Create ValidationRuleSchema
2. Add validation to all components
3. Update UI to apply validation
4. Update tests to use validation from JSON

**Impact:** Fixes validation test gaps

### Phase 2: Test Data (Week 2) - HIGH PRIORITY
1. Create TestDataSchema
2. Add test data to all journeys
3. Update tests to use test data from JSON

**Impact:** Enables data-driven testing

### Phase 3: Accessibility (Week 3) - MEDIUM PRIORITY
1. Create AccessibilityMetadataSchema
2. Add ARIA attributes to components
3. Generate accessibility tests

**Impact:** Improves a11y testing

### Phase 4: Test IDs (Week 4) - MEDIUM PRIORITY
1. Add testId to all components
2. Update tests to use test IDs
3. Add data-testid attributes to UI

**Impact:** More stable test selectors

---

## Complete Enhanced Example

```json
{
  "id": "register-a-plane",
  "pages": {
    "aircraft-details": {
      "components": [
        {
          "type": "textInput",
          "id": "aircraft-manufacturer",
          "testId": "input-manufacturer",
          "props": {
            "label": "Manufacturer",
            "hint": "For example, Cessna, Piper"
          },
          "validation": {
            "required": true,
            "minLength": 2,
            "maxLength": 100,
            "errorMessages": {
              "required": "Enter the aircraft manufacturer",
              "minLength": "Manufacturer must be at least 2 characters",
              "maxLength": "Manufacturer must be 100 characters or less"
            }
          },
          "accessibility": {
            "ariaLabel": "Aircraft manufacturer",
            "ariaRequired": true,
            "focusOnError": true
          },
          "testData": {
            "valid": "Cessna",
            "invalid": {
              "empty": {
                "value": "",
                "expectedError": "Enter the aircraft manufacturer"
              },
              "tooShort": {
                "value": "C",
                "expectedError": "Manufacturer must be at least 2 characters"
              }
            }
          }
        }
      ]
    }
  },
  "globalTestData": {
    "validJourney": {
      "aircraft-manufacturer": "Cessna",
      "aircraft-model": "172S",
      "email-address": "test@example.com"
    }
  }
}
```

---

## Key Takeaways

1. **Validation rules in JSON** = Single source of truth for UI and tests
2. **Test data in JSON** = Consistent, reusable test data
3. **Accessibility metadata** = Better a11y testing
4. **Test IDs** = Stable test selectors
5. **Automated generation** = Less manual test writing

**Next Steps:** Implement Phase 1 (Validation Rules) to address critical validation test gaps identified in test strategy review.
