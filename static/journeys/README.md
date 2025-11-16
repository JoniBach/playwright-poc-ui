# Journey JSON Files

This directory contains JSON configuration files for GOV.UK-style journeys.

## Structure

Each journey is defined in a separate JSON file (e.g., `passport.json`, `driving-licence.json`).

## JSON Schema

### Journey Object

```json
{
  "id": "unique-journey-id",
  "name": "Human Readable Name",
  "landingPage": { ... },
  "startPage": "page-id",
  "pages": { ... },
  "checkYourAnswersPage": "check-answers",
  "completionPage": "confirmation"
}
```

### Landing Page

```json
{
  "title": "Page Title",
  "lead": "Lead paragraph text",
  "sections": [
    {
      "type": "heading",
      "content": "Section Title",
      "level": "m"
    },
    {
      "type": "paragraph",
      "content": "Paragraph text"
    },
    {
      "type": "list",
      "listType": "bullet",
      "content": ["Item 1", "Item 2"]
    },
    {
      "type": "insetText",
      "content": "Important information"
    },
    {
      "type": "warningText",
      "content": "Warning message"
    },
    {
      "type": "details",
      "summary": "Click to expand",
      "content": "Hidden content"
    }
  ],
  "startButtonText": "Start now",
  "startButtonHref": "/journey"
}
```

### Pages

```json
{
  "pages": {
    "page-id": {
      "id": "page-id",
      "title": "Page Title",
      "components": [
        {
          "type": "textInput",
          "props": {
            "id": "fieldName",
            "name": "fieldName",
            "label": "Field Label",
            "hint": "Optional hint text",
            "autocomplete": "given-name"
          }
        }
      ],
      "nextPage": "next-page-id",
      "previousPage": "previous-page-id",
      "validation": "validation-rule-id"
    }
  }
}
```

## Component Types

Available component types:
- `textInput` - Text input field
- `textarea` - Multi-line text area
- `radios` - Radio button group
- `checkboxes` - Checkbox group
- `select` - Dropdown select
- `button` - Button
- `heading` - Heading text
- `paragraph` - Paragraph text
- `insetText` - Inset text box
- `warningText` - Warning text box
- `details` - Expandable details section
- `table` - Data table
- `tag` - Status tag
- `summaryList` - Summary list (for check your answers)
- `panel` - Success panel

## Validation Rules

Validation is handled by referencing validation rule IDs defined in `/src/lib/validation/rules.ts`.

Available validation rules:
- `personal-details` - Validates first name, last name, date of birth
- `contact-details` - Validates email and contact preference
- `address` - Validates address fields
- `required` - Generic required field validation

To add new validation rules, edit `/src/lib/validation/rules.ts`.

## Loading Journeys

Journeys are loaded using the journey loader:

```typescript
import { loadJourney } from '$lib/loaders/journey-loader';

const journey = await loadJourney('passport');
```

## Validation

All JSON files are validated against Zod schemas defined in `/src/lib/schemas/journey.schema.ts`.

This ensures:
- Type safety
- Required fields are present
- Data formats are correct
- Invalid configurations are caught early

## Creating a New Journey

1. Create a new JSON file in this directory (e.g., `my-service.json`)
2. Follow the schema structure above
3. Add any custom validation rules to `/src/lib/validation/rules.ts`
4. Update the loader to include your journey ID
5. Create a route to load and display your journey

## Example

See `passport.json` for a complete working example of a multi-page journey with landing page, form validation, and check your answers pattern.
