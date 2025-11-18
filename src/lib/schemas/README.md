# Journey Schema System

This directory contains comprehensive Zod schemas for validating journey configurations, making the app AI-ready and providing strict type safety.

## Overview

The schema system provides:
- **Strict validation** for all journey components and configurations
- **Type safety** with TypeScript integration
- **AI readiness** for OpenAI structured output generation
- **Runtime validation** to catch configuration errors early
- **Developer experience** improvements with IDE support

## Schema Files

### Core Schemas

#### `component.schema.ts`
Defines strict schemas for all journey component types:

**Form Input Components:**
- `TextInputSchema` - Text input fields with validation
- `EmailInputSchema` - Email input fields
- `TelInputSchema` - Phone number inputs
- `TextareaSchema` - Multi-line text areas
- `DateInputSchema` - Date input components
- `RadiosSchema` - Radio button groups
- `CheckboxesSchema` - Checkbox groups
- `SelectSchema` - Dropdown selects

**Content Components:**
- `HeadingSchema` - Page headings with levels
- `ParagraphSchema` - Text paragraphs
- `ListSchema` - Bullet and numbered lists
- `InsetTextSchema` - Highlighted text blocks
- `WarningTextSchema` - Warning messages
- `DetailsSchema` - Collapsible details sections

**Display Components:**
- `PanelSchema` - Information panels
- `SummaryListSchema` - Key-value summary lists
- `TableSchema` - Data tables
- `NotificationBannerSchema` - Success/error banners

**Interactive Components:**
- `ButtonSchema` - Action buttons and links

#### `journey.schema.ts`
Defines the overall journey structure:
- Journey metadata (id, name, etc.)
- Page definitions with components
- Navigation flow (nextPage, previousPage)
- Validation rule references
- Conditional routing support

#### `journey-index.schema.ts`
Defines the journey index structure:
- Journey metadata for the main index
- Department information
- Journey types (data-entry, data-lookup)

#### `validation-rules.schema.ts`
Defines validation rule structures:
- Field-level validation rules
- Page-level validation collections
- Conditional validation logic
- Custom validation functions

### Utility Files

#### `journey-validator.ts`
Comprehensive validation utility:
- Validates individual journeys
- Validates journey collections
- Checks cross-references (page links, validation rules)
- Provides detailed error reporting
- Generates validation summaries

## Usage Examples

### Validating a Component

```typescript
import { validateComponent, TextInputSchema } from './component.schema.js';

// Validate a text input component
const component = {
  type: 'textInput',
  props: {
    id: 'firstName',
    name: 'firstName',
    label: 'First name',
    autocomplete: 'given-name'
  }
};

try {
  const validComponent = validateComponent(component);
  console.log('✅ Component is valid');
} catch (error) {
  console.error('❌ Component validation failed:', error.message);
}
```

### Validating a Journey

```typescript
import { validateJourney } from './utils/journey-validator.js';

const journey = {
  id: 'my-journey',
  name: 'My Journey',
  startPage: 'start',
  pages: {
    start: {
      id: 'start',
      title: 'Start Page',
      components: [
        {
          type: 'heading',
          props: {
            text: 'Welcome',
            level: 'xl'
          }
        }
      ]
    }
  }
};

const errors = validateJourney(journey, 'my-journey');
if (errors.length === 0) {
  console.log('✅ Journey is valid');
} else {
  console.error('❌ Journey has errors:', errors);
}
```

### Type Guards

```typescript
import { isComponentOfType } from './component.schema.js';

if (isComponentOfType(component, 'textInput')) {
  // TypeScript now knows component is a TextInputComponent
  console.log(component.props.label); // Type-safe access
}
```

## Component Property Reference

### TextInput Component

```typescript
{
  type: 'textInput',
  props: {
    id: string,              // Required: Unique identifier
    name: string,            // Required: Form field name
    label: string,           // Required: Field label
    hint?: string,           // Optional: Help text
    value?: string,          // Optional: Default value
    width?: '5'|'10'|'20'|'30'|'full', // Optional: Field width
    autocomplete?: string,   // Optional: Browser autocomplete
    spellcheck?: boolean,    // Optional: Enable spellcheck
    disabled?: boolean,      // Optional: Disable field
    readonly?: boolean       // Optional: Read-only field
  }
}
```

### Radios Component

```typescript
{
  type: 'radios',
  props: {
    id: string,              // Required: Unique identifier
    name: string,            // Required: Form field name
    legend: string,          // Required: Fieldset legend
    hint?: string,           // Optional: Help text
    items: Array<{           // Required: Radio options
      value: string,         // Option value
      text: string,          // Option label
      hint?: string,         // Option help text
      checked?: boolean,     // Default selection
      disabled?: boolean,    // Disable option
      conditional?: {        // Conditional content
        html: string
      }
    }>
  }
}
```

### Heading Component

```typescript
{
  type: 'heading',
  props: {
    text: string,            // Required: Heading text
    content?: string,        // Alternative to text
    level?: 's'|'m'|'l'|'xl', // Optional: Size level
    size?: 's'|'m'|'l'|'xl',  // Alternative to level
    tag?: 'h1'|'h2'|'h3'|'h4'|'h5'|'h6', // HTML tag
    caption?: string         // Optional: Caption text
  }
}
```

## Validation Integration

### Startup Validation

Add validation to your app startup:

```typescript
import { validateAllJourneys, formatValidationResults } from './utils/journey-validator.js';

async function validateJourneysOnStartup() {
  const journeys = await loadAllJourneys();
  const journeyIndex = await loadJourneyIndex();
  
  const result = validateAllJourneys(journeys, journeyIndex);
  
  console.log(formatValidationResults(result));
  
  if (!result.isValid) {
    throw new Error('Journey validation failed - see errors above');
  }
}
```

### Development Validation

Use the test script to validate during development:

```bash
node src/lib/utils/simple-validation-test.js
```

## AI Integration Ready

The schemas are designed to work seamlessly with OpenAI's structured output:

```typescript
import { ComponentSchema } from './component.schema.js';

// Use with OpenAI structured output
const completion = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "user",
      content: "Generate a form component for collecting user's name"
    }
  ],
  response_format: {
    type: "json_schema",
    json_schema: {
      name: "component",
      schema: zodToJsonSchema(ComponentSchema)
    }
  }
});
```

## Migration Guide

### From Loose to Strict Schemas

1. **Update component props**: Ensure all required properties are present
2. **Fix property names**: Use `text` instead of `content` for headings/paragraphs
3. **Standardize arrays**: Use `items` for radios/checkboxes, not `options`
4. **Add validation**: Reference field schemas in `field-schemas.ts`

### Common Fixes

```typescript
// ❌ Old format
{
  type: 'heading',
  props: {
    content: 'My Heading'  // Should be 'text'
  }
}

// ✅ New format
{
  type: 'heading',
  props: {
    text: 'My Heading'
  }
}
```

```typescript
// ❌ Old format
{
  type: 'radios',
  props: {
    options: [...]  // Should be 'items'
  }
}

// ✅ New format
{
  type: 'radios',
  props: {
    items: [...]
  }
}
```

## Benefits

### For Developers
- **Type Safety**: Catch errors at compile time
- **IDE Support**: Autocomplete and validation in editors
- **Documentation**: Schemas serve as living documentation
- **Refactoring**: Safe component property changes

### For the Application
- **Runtime Validation**: Catch configuration errors early
- **Better Error Messages**: Detailed validation feedback
- **Consistency**: Enforce consistent component structure
- **Maintainability**: Easier to update and extend

### For AI Integration
- **Structured Output**: Direct compatibility with OpenAI
- **Validation**: AI-generated content is automatically validated
- **Type Safety**: Generated journeys are type-safe
- **Extensibility**: Easy to add new component types

## Testing

Run the validation test suite:

```bash
# Test all existing journeys
node src/lib/utils/simple-validation-test.js

# Expected output: ✅ All journeys are structurally valid!
```

## Contributing

When adding new component types:

1. Add the schema to `component.schema.ts`
2. Update the discriminated union in `ComponentSchema`
3. Add validation tests
4. Update this documentation
5. Test with existing journeys

## Future Enhancements

- **Visual Schema Editor**: Build a UI for editing schemas
- **Schema Versioning**: Support multiple schema versions
- **Custom Validators**: Add domain-specific validation rules
- **Performance Optimization**: Cache validation results
- **Integration Testing**: Automated journey validation in CI/CD
