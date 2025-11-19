# AI Generator Improvements - Complete Solution

**Date:** November 19, 2025  
**Status:** ✅ Complete

---

## 🎯 Problem Solved

**Issue:** AI-generated journeys had inconsistencies that broke the API and UI:
1. ❌ Wrong page ID naming (`check-answers` vs `check-your-answers`)
2. ❌ Missing validation rules on input components
3. ❌ Inconsistent error messages
4. ❌ Missing required journey properties

**Solution:** Created comprehensive AI prompt template + automated validation script

---

## 📚 What Was Created

### 1. **Complete AI Prompt Template** ✅
**File:** `AI_GENERATOR_PROMPT.md`

A comprehensive prompt template that ensures AI generates:
- ✅ Correct page ID naming (`check-your-answers`)
- ✅ Validation rules on ALL input components
- ✅ GOV.UK-style error messages
- ✅ Proper navigation flow
- ✅ API-compatible structure

**Key Features:**
- Detailed validation examples for every component type
- GOV.UK error message guidelines
- Complete working examples
- Common mistakes to avoid
- Success criteria checklist

### 2. **Automated Validation Script** ✅
**File:** `scripts/validate-journey.ts`

A TypeScript script that validates AI-generated journeys and provides helpful fixes.

**Checks:**
- ✅ Required journey properties (id, name, checkYourAnswersPage, etc.)
- ✅ Page ID naming conventions (kebab-case)
- ✅ Validation rules on input components
- ✅ Error message style (imperative verbs)
- ✅ Component structure (id, props consistency)
- ✅ Navigation flow (nextPage, previousPage)
- ✅ Pattern validation for email/phone fields

**Output:**
```
🔍 Validating journey: static/journeys/my-journey.json

📊 Validation Summary:
  Total pages: 5
  Total components: 12
  Input components: 8
  Components with validation: 8
  Validation coverage: 100%

✅ Journey validation passed!
🎉 This journey is ready to use!
```

---

## 🚀 How to Use

### **Step 1: Generate Journey with AI**

Use the complete prompt from `AI_GENERATOR_PROMPT.md`:

```typescript
import { zodResponseFormat } from 'openai/helpers/zod';
import { JourneySchema } from './src/lib/schemas/journey.schema';

const completion = await openai.chat.completions.create({
  model: "gpt-4o-2024-08-06",
  messages: [
    {
      role: "system",
      content: `[PASTE COMPLETE PROMPT FROM AI_GENERATOR_PROMPT.md]`
    },
    {
      role: "user",
      content: "Create a journey for applying for a driving licence"
    }
  ],
  response_format: zodResponseFormat(JourneySchema, "journey")
});

const journey = completion.choices[0].message.parsed;
```

### **Step 2: Save the Journey**

```bash
# Save to static/journeys/
echo $journey > static/journeys/driving-licence-apply.json
```

### **Step 3: Validate the Journey**

```bash
# Run the validation script
npx tsx scripts/validate-journey.ts static/journeys/driving-licence-apply.json
```

**Example Output:**
```
🔍 Validating journey: static/journeys/driving-licence-apply.json

📊 Validation Summary:
  Total pages: 4
  Total components: 10
  Input components: 6
  Components with validation: 5
  Validation coverage: 83%

❌ 2 Error(s) found:

  1. Component "email-address" on page "contact-details" missing validation
     💡 Fix: Add validation object with required and errorMessages

  2. checkYourAnswersPage should be "check-your-answers", got "check-answers"
     💡 Fix: Change to "checkYourAnswersPage": "check-your-answers"

⚠️  1 Warning(s) found:

  1. Component "full-name" error message doesn't start with imperative verb: "Full name is required"
     💡 Fix: Change to: "Enter your full name"
```

### **Step 4: Fix Issues**

Fix the errors reported by the validation script, then re-validate:

```bash
npx tsx scripts/validate-journey.ts static/journeys/driving-licence-apply.json
```

### **Step 5: Test the Journey**

```bash
# Start dev server
npm run dev

# Navigate to journey
http://localhost:5174/dvla/driving-licence-apply/apply

# Test:
# 1. Fill out forms
# 2. Check validation errors appear
# 3. Submit and verify reference number
```

---

## 📋 Validation Checklist

Use this checklist when generating journeys:

### **Critical Requirements** ✅
- [ ] `checkYourAnswersPage: "check-your-answers"` (exact match)
- [ ] `completionPage: "confirmation"` or similar
- [ ] Page with id `"check-your-answers"` exists
- [ ] Page with id `"confirmation"` exists
- [ ] All page IDs use kebab-case

### **Validation Rules** ✅
- [ ] Every textInput has validation
- [ ] Every email field has `pattern: "email"`
- [ ] Every phone field has `pattern: "phone"`
- [ ] All required fields have `required: true`
- [ ] All error messages start with imperative verbs
- [ ] Error messages include helpful examples

### **Component Structure** ✅
- [ ] Every component has unique `id`
- [ ] `component.id === component.props.id === component.props.name`
- [ ] All components have `props.label`
- [ ] Input components have appropriate `autocomplete`

### **Navigation** ✅
- [ ] Every page has `nextPage` (except last)
- [ ] Every page has `previousPage` (except first)
- [ ] Last content page → `check-your-answers`
- [ ] check-your-answers → `confirmation`

---

## 🎯 Example: Perfect Journey Structure

```json
{
  "id": "passport-apply",
  "name": "Apply for a passport",
  "checkYourAnswersPage": "check-your-answers",
  "completionPage": "confirmation",
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
            "type": "text",
            "autocomplete": "name"
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
            "type": "email",
            "autocomplete": "email"
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
    },
    
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
      "previousPage": "applicant-details"
    },
    
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
        }
      ],
      "previousPage": "check-your-answers"
    }
  }
}
```

---

## ⚠️ Common Mistakes Fixed

### **Before (Broken):**
```json
{
  "checkYourAnswersPage": "check-answers",  // ❌ Wrong ID
  "pages": {
    "check-answers": {  // ❌ Doesn't match expected ID
      "id": "checkAnswers",  // ❌ camelCase
      "components": [
        {
          "type": "textInput",
          "id": "emailAddress",  // ❌ camelCase
          "props": {
            "id": "email",  // ❌ Inconsistent
            "name": "email-address",  // ❌ Inconsistent
            "label": "Email"
          }
          // ❌ No validation!
        }
      ]
    }
  }
}
```

### **After (Working):**
```json
{
  "checkYourAnswersPage": "check-your-answers",  // ✅ Correct
  "pages": {
    "check-your-answers": {  // ✅ Matches
      "id": "check-your-answers",  // ✅ kebab-case
      "components": [
        {
          "type": "textInput",
          "id": "email-address",  // ✅ kebab-case
          "props": {
            "id": "email-address",  // ✅ Consistent
            "name": "email-address",  // ✅ Consistent
            "label": "Email address"
          },
          "validation": {  // ✅ Has validation
            "required": true,
            "pattern": "email",
            "errorMessages": {
              "required": "Enter your email address",
              "pattern": "Enter an email address in the correct format, like name@example.com"
            }
          }
        }
      ]
    }
  }
}
```

---

## 🎉 Benefits

### **For Developers:**
- ✅ Consistent journey structure
- ✅ Automated validation catches errors early
- ✅ Clear error messages with fixes
- ✅ Less manual debugging

### **For AI Generation:**
- ✅ Comprehensive prompt template
- ✅ Examples for every component type
- ✅ GOV.UK guidelines built-in
- ✅ Validation rules included automatically

### **For Testing:**
- ✅ All journeys work with API
- ✅ Server-side validation works
- ✅ Helpful error messages for users
- ✅ End-to-end testing possible

---

## 📦 Files Created

1. **`AI_GENERATOR_PROMPT.md`** - Complete AI prompt template
2. **`scripts/validate-journey.ts`** - Automated validation script
3. **`AI_GENERATION_WITH_VALIDATION.md`** - Validation examples
4. **`AI_GENERATOR_IMPROVEMENTS.md`** - This document

---

## 🚀 Quick Start

```bash
# 1. Generate journey with AI using the prompt template
# 2. Save to static/journeys/my-journey.json
# 3. Validate:
npx tsx scripts/validate-journey.ts static/journeys/my-journey.json

# 4. Fix any errors
# 5. Re-validate
# 6. Test in browser
npm run dev
# Navigate to: http://localhost:5174/[department]/[journey-id]/apply
```

---

## ✅ Success!

The AI generator now produces:
- ✅ API-compatible journeys
- ✅ Proper validation rules
- ✅ GOV.UK-style error messages
- ✅ Working check your answers pages
- ✅ Complete end-to-end flows

**No more broken journeys from AI generation!** 🎉
