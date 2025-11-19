# Journey Form Submission API

**Purpose:** Dynamic SvelteKit server endpoints for journey form submissions, enabling end-to-end testing of complete journey flows.

**Created:** November 19, 2025

---

## Overview

The journey submission API provides dynamic server endpoints that match the journey routing structure. When a journey form is submitted, it makes a real POST request to the server, validates the data, and returns a proper response with the next page or completion status.

**Key Features:**
- ✅ Dynamic routing matching journey structure
- ✅ Server-side validation using journey JSON configuration
- ✅ Conditional routing support
- ✅ Reference number generation for completed journeys
- ✅ GOV.UK error pattern support
- ✅ Full end-to-end testing capability

---

## API Endpoint

### POST `/[department]/[slug]/apply?page=[currentPage]`

**Example:**
```
POST /civil-aviation-authority/register-a-plane/apply?page=aircraft-details
```

**Request Body:** `FormData`
```
aircraft-manufacturer: Cessna
aircraft-model: 172S
aircraft-serial-number: 17280001
_currentPage: aircraft-details
```

**Success Response (200):**
```json
{
  "success": true,
  "complete": false,
  "nextPage": "contact-details",
  "currentPage": "aircraft-details",
  "data": {
    "aircraft-manufacturer": "Cessna",
    "aircraft-model": "172S",
    "aircraft-serial-number": "17280001"
  }
}
```

**Validation Error Response (400):**
```json
{
  "success": false,
  "errors": [
    {
      "field": "aircraft-manufacturer",
      "message": "Enter the aircraft manufacturer"
    },
    {
      "field": "email-address",
      "message": "Enter an email address in the correct format"
    }
  ],
  "page": "aircraft-details"
}
```

**Completion Response (200):**
```json
{
  "success": true,
  "complete": true,
  "referenceNumber": "APP-L8X9K2M-7N4P3",
  "message": "Application submitted successfully",
  "nextPage": "confirmation",
  "data": { /* all form data */ }
}
```

---

## Server-Side Validation

The server endpoint validates form data using the journey JSON configuration. When you add validation rules to your journey JSON (as recommended in `TESTING_IMPROVEMENTS.md`), the server will automatically validate against those rules.

### Supported Validation Rules

**Required Fields:**
```json
{
  "validation": {
    "required": true,
    "errorMessages": {
      "required": "Enter the aircraft manufacturer"
    }
  }
}
```

**Pattern Validation:**
```json
{
  "validation": {
    "pattern": "email",
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
- `ni-number` - National Insurance number format

**Length Validation:**
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

---

## Conditional Routing

The server endpoint supports conditional routing based on form data:

**Journey JSON:**
```json
{
  "id": "applicant-type",
  "conditionalRouting": {
    "default": "aircraft-details",
    "conditions": [
      {
        "when": {
          "field": "applicant-type",
          "operator": "equals",
          "value": "organisation"
        },
        "goto": "organisation-details"
      }
    ]
  }
}
```

**Supported Operators:**
- `equals` - Field value equals expected value
- `notEquals` - Field value does not equal expected value
- `contains` - Field value contains expected value
- `greaterThan` - Field value is greater than expected value
- `lessThan` - Field value is less than expected value
- `isEmpty` - Field value is empty
- `isNotEmpty` - Field value is not empty

---

## Client-Side Usage

### Using the Form Submission Utility

```typescript
import { submitJourneyForm, displayValidationErrors } from '$lib/utils/form-submission';

// In your Svelte component
async function handleSubmit(event: SubmitEvent) {
  event.preventDefault();
  
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  
  const response = await submitJourneyForm(
    'civil-aviation-authority',
    'register-a-plane',
    'aircraft-details',
    formData
  );
  
  if (response.success) {
    if (response.complete) {
      // Journey complete - navigate to confirmation
      window.location.href = `/civil-aviation-authority/register-a-plane/${response.nextPage}`;
    } else {
      // Navigate to next page
      window.location.href = `/civil-aviation-authority/register-a-plane/apply/${response.nextPage}`;
    }
  } else {
    // Display validation errors
    if (response.errors) {
      displayValidationErrors(response.errors);
    }
  }
}
```

### Using the handleFormSubmit Helper

```typescript
import { handleFormSubmit } from '$lib/utils/form-submission';

async function onSubmit(event: SubmitEvent) {
  const response = await handleFormSubmit(
    event,
    'civil-aviation-authority',
    'register-a-plane',
    'aircraft-details',
    // Success callback
    (res) => {
      if (res.complete) {
        console.log('Journey complete!', res.referenceNumber);
      }
      window.location.href = `.../${res.nextPage}`;
    },
    // Error callback
    (res) => {
      if (res.errors) {
        displayValidationErrors(res.errors);
      }
    }
  );
}
```

---

## Playwright Testing

The API endpoint enables comprehensive end-to-end testing:

### Test Complete Journey Flow

```typescript
test('should complete register a plane journey', async ({ page }) => {
  // Start journey
  await page.goto('/civil-aviation-authority/register-a-plane/apply');
  
  // Page 1: Select applicant type
  await page.getByLabel('An individual').check();
  await page.getByRole('button', { name: 'Continue' }).click();
  
  // Wait for server response and navigation
  await page.waitForURL('**/aircraft-details');
  
  // Page 2: Enter aircraft details
  await page.fill('#aircraft-manufacturer', 'Cessna');
  await page.fill('#aircraft-model', '172S');
  await page.fill('#aircraft-serial-number', '17280001');
  await page.getByRole('button', { name: 'Continue' }).click();
  
  // Wait for navigation
  await page.waitForURL('**/contact-details');
  
  // Page 3: Enter contact details
  await page.fill('#full-name', 'John Smith');
  await page.fill('#email-address', 'john.smith@example.com');
  await page.fill('#telephone-number', '+44 7700 900000');
  await page.getByRole('button', { name: 'Continue' }).click();
  
  // Wait for check your answers page
  await page.waitForURL('**/check-your-answers');
  
  // Submit application
  await page.getByRole('button', { name: 'Submit' }).click();
  
  // Wait for confirmation page
  await page.waitForURL('**/confirmation');
  
  // Verify completion
  await expect(page.getByRole('heading', { name: 'Application submitted' }))
    .toBeVisible();
  
  // Verify reference number is displayed
  await expect(page.getByText(/APP-[A-Z0-9]+-[A-Z0-9]+/))
    .toBeVisible();
});
```

### Test Server-Side Validation

```typescript
test('should validate required fields on server', async ({ page }) => {
  await page.goto('/civil-aviation-authority/register-a-plane/apply/aircraft-details');
  
  // Submit without filling fields
  await page.getByRole('button', { name: 'Continue' }).click();
  
  // Server should return validation errors
  // Error summary should appear
  await expect(page.locator('.govuk-error-summary')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'There is a problem' }))
    .toBeVisible();
  
  // Field-level errors should appear
  await expect(page.getByText('Enter the aircraft manufacturer')).toBeVisible();
  await expect(page.getByText('Enter the aircraft model')).toBeVisible();
  await expect(page.getByText('Enter the serial number')).toBeVisible();
});
```

### Test Conditional Routing

```typescript
test('should route to organisation details for organisation applicants', async ({ page }) => {
  await page.goto('/civil-aviation-authority/register-a-plane/apply');
  
  // Select organisation
  await page.getByLabel('A company or organisation').check();
  await page.getByRole('button', { name: 'Continue' }).click();
  
  // Should navigate to organisation-details (not aircraft-details)
  await page.waitForURL('**/organisation-details');
  await expect(page.getByRole('heading', { name: 'Organisation details' }))
    .toBeVisible();
});
```

### Test API Response Directly

```typescript
test('should return correct API response', async ({ request }) => {
  const formData = new FormData();
  formData.append('aircraft-manufacturer', 'Cessna');
  formData.append('aircraft-model', '172S');
  formData.append('aircraft-serial-number', '17280001');
  formData.append('_currentPage', 'aircraft-details');
  
  const response = await request.post(
    '/civil-aviation-authority/register-a-plane/apply?page=aircraft-details',
    { data: formData }
  );
  
  expect(response.ok()).toBeTruthy();
  
  const data = await response.json();
  expect(data.success).toBe(true);
  expect(data.nextPage).toBe('contact-details');
  expect(data.complete).toBe(false);
});
```

---

## Reference Number Generation

When a journey is completed (final submission from check-your-answers page), the server generates a unique reference number:

**Format:** `APP-[TIMESTAMP]-[RANDOM]`

**Example:** `APP-L8X9K2M-7N4P3`

**Components:**
- `APP` - Prefix indicating application
- `L8X9K2M` - Base36 encoded timestamp
- `7N4P3` - Random 5-character string

This reference number is returned in the completion response and can be displayed to the user on the confirmation page.

---

## Error Handling

### Server Errors

**Journey Not Found (404):**
```json
{
  "success": false,
  "error": "Journey not found",
  "journeyId": "unknown-journey"
}
```

**Internal Server Error (500):**
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Error details..."
}
```

### Client-Side Error Handling

```typescript
const response = await submitJourneyForm(...);

if (!response.success) {
  if (response.errors) {
    // Validation errors - display to user
    displayValidationErrors(response.errors);
  } else if (response.error) {
    // Server error - show error message
    console.error('Server error:', response.error, response.message);
    alert('An error occurred. Please try again.');
  }
}
```

---

## Integration with Journey JSON

The server endpoint reads validation rules, conditional routing, and other configuration directly from the journey JSON files. This means:

1. **Single Source of Truth** - Journey JSON defines both UI and server behavior
2. **Automatic Validation** - Add validation to JSON, server validates automatically
3. **Testable** - Tests can verify server validates according to JSON config
4. **Maintainable** - Change validation in one place, affects UI and server

**Example Journey JSON with Validation:**
```json
{
  "pages": {
    "aircraft-details": {
      "components": [
        {
          "type": "textInput",
          "id": "aircraft-manufacturer",
          "props": {
            "label": "Manufacturer"
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
          }
        }
      ],
      "nextPage": "contact-details"
    }
  }
}
```

---

## Next Steps

1. **Add Validation Rules** - Enhance journey JSON files with validation rules (see `TESTING_IMPROVEMENTS.md`)
2. **Update UI Components** - Make form components submit to the API endpoint
3. **Write E2E Tests** - Create comprehensive journey tests using the API
4. **Add More Journeys** - Extend the system to all 20+ journeys

---

## Benefits for Testing

✅ **Real Server Validation** - Tests verify actual server-side validation, not just UI  
✅ **Complete Journey Flows** - Test entire journey from start to completion  
✅ **Reference Numbers** - Verify reference number generation and display  
✅ **Conditional Routing** - Test complex routing logic  
✅ **Error Handling** - Test validation error display and recovery  
✅ **API Testing** - Test API responses directly without UI  
✅ **Single Source of Truth** - Journey JSON defines both UI and server behavior

This addresses the critical testing gaps identified in the test strategy review!
