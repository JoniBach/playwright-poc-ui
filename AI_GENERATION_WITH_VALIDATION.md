# AI Journey Generation with Validation Rules

**Purpose:** Guide for generating journey JSON files with validation rules using OpenAI structured output.

**Date:** November 19, 2025

---

## Overview

The journey schemas now support a `validation` property on components, enabling server-side validation with helpful error messages. When using AI to generate journeys, you should include validation rules in the prompt.

---

## Updated Component Schema with Validation

### **Validation Property Structure**

```typescript
{
  "validation": {
    "required": boolean,
    "minLength": number,
    "maxLength": number,
    "pattern": "email" | "phone" | "postcode" | "url" | "ni-number",
    "customPattern": string,  // regex pattern
    "errorMessages": {
      "required": string,
      "minLength": string,
      "maxLength": string,
      "pattern": string
    }
  }
}
```

---

## OpenAI Structured Output Example

### **Updated Prompt Template**

```typescript
import { zodResponseFormat } from 'openai/helpers/zod';
import { JourneySchema } from './lib/schemas/journey.schema';

const completion = await openai.chat.completions.create({
  model: "gpt-4o-2024-08-06",
  messages: [
    {
      role: "system",
      content: `You are a GOV.UK journey designer. Create a journey JSON with:
      
1. Clear, user-friendly component labels and hints
2. Validation rules for all input fields including:
   - required: true/false
   - minLength/maxLength for text fields
   - pattern: "email", "phone", "postcode", etc.
   - Custom error messages in GOV.UK style
3. Error messages should:
   - Start with an imperative verb (e.g., "Enter", "Select")
   - Be specific and helpful
   - Follow GOV.UK content guidelines
   
Example validation for email field:
{
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
}`
    },
    {
      role: "user",
      content: "Create a journey for applying for a passport"
    }
  ],
  response_format: zodResponseFormat(JourneySchema, "journey")
});

const journey = completion.choices[0].message.parsed;
```

---

## Validation Rules by Component Type

### **Text Input / Email / Tel / Textarea**

```json
{
  "type": "textInput",
  "id": "full-name",
  "props": {
    "name": "full-name",
    "label": "Full name",
    "type": "text"
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

### **Email Field**

```json
{
  "type": "textInput",
  "id": "email-address",
  "props": {
    "name": "email-address",
    "label": "Email address",
    "type": "email"
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

### **Phone Field**

```json
{
  "type": "textInput",
  "id": "telephone-number",
  "props": {
    "name": "telephone-number",
    "label": "Telephone number",
    "type": "tel"
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

### **Postcode Field**

```json
{
  "type": "textInput",
  "id": "postcode",
  "props": {
    "name": "postcode",
    "label": "Postcode",
    "type": "text"
  },
  "validation": {
    "required": true,
    "pattern": "postcode",
    "errorMessages": {
      "required": "Enter a postcode",
      "pattern": "Enter a real postcode, like SW1A 1AA"
    }
  }
}
```

### **Radios (Required Selection)**

```json
{
  "type": "radios",
  "id": "applicant-type",
  "props": {
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

### **Custom Pattern**

```json
{
  "type": "textInput",
  "id": "reference-number",
  "props": {
    "name": "reference-number",
    "label": "Reference number",
    "hint": "This is 3 letters followed by 4 numbers, like ABC1234"
  },
  "validation": {
    "required": true,
    "customPattern": "^[A-Z]{3}\\d{4}$",
    "errorMessages": {
      "required": "Enter your reference number",
      "pattern": "Enter a reference number in the correct format, like ABC1234"
    }
  }
}
```

---

## GOV.UK Error Message Guidelines

When generating error messages, follow these rules:

### **1. Start with an Imperative Verb**
- ✅ "Enter your email address"
- ❌ "Email address is required"

### **2. Be Specific**
- ✅ "Enter an email address in the correct format, like name@example.com"
- ❌ "Invalid email"

### **3. Provide Examples**
- ✅ "Enter a telephone number, like 01632 960 001"
- ❌ "Enter a valid phone number"

### **4. Use Plain English**
- ✅ "Full name must be 100 characters or less"
- ❌ "Maximum length exceeded"

### **5. Be Helpful**
- ✅ "Enter a real postcode, like SW1A 1AA"
- ❌ "Postcode format invalid"

---

## Complete Example Journey with Validation

```json
{
  "id": "passport-apply",
  "name": "Apply for a passport",
  "startPage": "applicant-details",
  "pages": {
    "applicant-details": {
      "id": "applicant-details",
      "title": "Your details",
      "components": [
        {
          "type": "textInput",
          "id": "full-name",
          "props": {
            "id": "full-name",
            "name": "full-name",
            "label": "Full name",
            "hint": "This should match the name on your birth certificate",
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
        },
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
      ],
      "nextPage": "check-your-answers"
    }
  },
  "checkYourAnswersPage": "check-your-answers",
  "completionPage": "confirmation"
}
```

---

## Validation Patterns Reference

### **Available Patterns**

| Pattern | Regex | Example |
|---------|-------|---------|
| `email` | `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | `name@example.com` |
| `phone` | `/^[\d\s\+\-\(\)]+$/` | `+44 7700 900000` |
| `postcode` | `/^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i` | `SW1A 1AA` |
| `url` | `/^https?:\/\/.+/` | `https://example.com` |
| `ni-number` | `/^[A-Z]{2}\d{6}[A-Z]$/i` | `AB123456C` |

### **Custom Pattern Example**

For patterns not in the list above, use `customPattern`:

```json
{
  "validation": {
    "customPattern": "^[A-Z]{2}\\d{6}$",
    "errorMessages": {
      "pattern": "Enter a reference number in the correct format, like AB123456"
    }
  }
}
```

---

## AI Prompt Template

Use this template when asking AI to generate journeys:

```
Create a GOV.UK journey for [JOURNEY PURPOSE].

Requirements:
1. Include validation rules for ALL input fields
2. Use appropriate validation patterns (email, phone, postcode, etc.)
3. Set reasonable min/max lengths for text fields
4. Write error messages following GOV.UK guidelines:
   - Start with imperative verbs (Enter, Select, etc.)
   - Be specific and helpful
   - Include examples where appropriate
5. Make required fields explicit with "required": true

Example component with validation:
{
  "type": "textInput",
  "id": "email-address",
  "props": {
    "name": "email-address",
    "label": "Email address",
    "type": "email"
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

Generate the complete journey JSON now.
```

---

## Testing AI-Generated Journeys

After generating a journey with AI, test the validation:

```bash
# 1. Save the generated JSON to static/journeys/
# 2. Start the dev server
npm run dev

# 3. Navigate to the journey
http://localhost:5173/[department]/[journey-slug]/apply

# 4. Test validation by:
# - Leaving required fields empty
# - Entering invalid email/phone formats
# - Exceeding max lengths
# - Using invalid patterns

# 5. Verify error messages match the journey JSON
```

---

## Benefits of AI-Generated Validation

✅ **Consistent validation** across all journeys  
✅ **Helpful error messages** following GOV.UK guidelines  
✅ **Reduced manual work** - AI generates validation rules  
✅ **Type-safe** - Zod validates the structure  
✅ **Testable** - Server validates using the same rules  
✅ **Single source of truth** - Journey JSON defines everything

---

## Summary

When using AI to generate journeys:

1. **Include validation in your prompt** - Ask for validation rules on all input fields
2. **Specify error message style** - Request GOV.UK-style error messages
3. **Use appropriate patterns** - email, phone, postcode, etc.
4. **Set reasonable limits** - minLength, maxLength based on field type
5. **Test the output** - Verify validation works as expected

The AI will generate journey JSON that works seamlessly with the server-side validation system!
