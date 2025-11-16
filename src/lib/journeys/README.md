# Multi-Page Journey System

A comprehensive journey management system following GOV.UK Design System patterns for building multi-page forms and services.

## Features

- ✅ **JSON-driven configuration** - Define entire journeys in JSON
- ✅ **State management** - Automatic form data persistence
- ✅ **Validation** - Per-page validation with error handling
- ✅ **Navigation** - Forward/backward navigation with progress tracking
- ✅ **Conditional routing** - Dynamic next page based on user answers
- ✅ **Check your answers** - Standard GDS pattern for review before submission
- ✅ **Progress tracking** - Visual progress through the journey
- ✅ **Accessibility** - Full ARIA support and keyboard navigation

## Quick Start

### 1. Define Your Journey

Create a journey configuration:

```typescript
import type { Journey } from '$lib/types/journey';

export const myJourney: Journey = {
  id: 'my-service',
  name: 'My Service',
  startPage: 'start',
  checkYourAnswersPage: 'check-answers',
  completionPage: 'confirmation',
  pages: {
    start: {
      id: 'start',
      title: 'Start your application',
      components: [
        {
          type: 'paragraph',
          props: {
            text: 'Use this service to...',
            lead: true
          }
        }
      ],
      nextPage: 'personal-details'
    },
    'personal-details': {
      id: 'personal-details',
      title: 'Your details',
      components: [
        {
          type: 'textInput',
          props: {
            id: 'name',
            name: 'name',
            label: 'Full name'
          }
        }
      ],
      nextPage: 'check-answers',
      previousPage: 'start',
      validation: (data) => {
        if (!data.name) {
          return { name: 'Enter your name' };
        }
        return null;
      }
    }
  }
};
```

### 2. Create a Journey Page

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import JourneyPage from '$lib/components/journey/JourneyPage.svelte';
  import CheckYourAnswers from '$lib/components/journey/CheckYourAnswers.svelte';
  import { journeyStore } from '$lib/stores/journey.svelte';
  import { myJourney } from '$lib/journeys/my-journey';

  const state = $derived(journeyStore.currentState);
  const isCheckAnswers = $derived(state.currentPageId === 'check-answers');
  const isCompleted = $derived(state.completed);

  onMount(() => {
    journeyStore.initJourney(myJourney);
  });

  function handleSubmit() {
    console.log('Submitted:', state.data);
    journeyStore.currentState.completed = true;
  }
</script>

{#if isCompleted}
  <!-- Completion page -->
{:else if isCheckAnswers}
  <CheckYourAnswers onSubmit={handleSubmit} />
{:else}
  <JourneyPage />
{/if}
```

## Journey Configuration

### Journey Object

```typescript
interface Journey {
  id: string;                    // Unique journey identifier
  name: string;                  // Display name
  startPage: string;             // ID of first page
  pages: Record<string, JourneyPage>;  // All pages
  checkYourAnswersPage?: string; // Optional CYA page ID
  completionPage?: string;       // Optional completion page ID
}
```

### Page Object

```typescript
interface JourneyPage {
  id: string;                    // Unique page identifier
  title: string;                 // Page heading
  components: ComponentConfig[]; // Array of components
  nextPage?: string | ((data) => string);  // Next page or function
  previousPage?: string;         // Previous page ID
  validation?: (data) => Record<string, string> | null;  // Validation function
}
```

## Validation

Add validation to any page:

```typescript
validation: (data) => {
  const errors: Record<string, string> = {};
  
  if (!data.email) {
    errors.email = 'Enter your email address';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Enter a valid email address';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
}
```

## Conditional Routing

Route to different pages based on user answers:

```typescript
nextPage: (data) => {
  if (data.hasPassport === 'yes') {
    return 'passport-details';
  }
  return 'apply-for-passport';
}
```

## Journey Store API

### Methods

- `initJourney(journey)` - Initialize a new journey
- `updateData(key, value)` - Update form field data
- `goToNextPage()` - Navigate to next page (with validation)
- `goToPreviousPage()` - Navigate to previous page
- `goToPage(pageId)` - Navigate to specific page
- `validateCurrentPage()` - Validate current page
- `getSummary()` - Get all collected data
- `reset()` - Reset journey to start
- `getError(fieldKey)` - Get error for field
- `getValue(fieldKey)` - Get value for field

### Properties

- `currentJourney` - Current journey configuration
- `currentState` - Current journey state
- `currentPage` - Current page object
- `canGoBack` - Whether back navigation is available
- `progress` - Progress percentage (0-100)

## State Management

The journey store automatically manages:

- **Form data** - All user inputs
- **Validation errors** - Field-level errors
- **Navigation history** - Visited pages
- **Current position** - Active page
- **Completion status** - Journey completion state

## GDS Patterns Implemented

### One Thing Per Page
Each page focuses on a single question or topic.

### Check Your Answers
Review all answers before submission with change links.

### Validation
Clear, actionable error messages linked to form fields.

### Progress Indication
Track progress through the journey.

### Back Links
Easy navigation to previous pages.

## Example Journey

See `/src/lib/journeys/example-journey.ts` for a complete passport application example including:

- Multiple pages with different question types
- Form validation
- Contact preference collection
- Address capture
- Check your answers page
- Confirmation page

## Testing

Access the example journey at `/journey` to see the system in action.

## Best Practices

1. **Keep pages focused** - One question per page when possible
2. **Validate early** - Validate on each page before proceeding
3. **Clear errors** - Provide specific, actionable error messages
4. **Save progress** - Consider persisting state to localStorage
5. **Accessibility** - Use proper labels, hints, and ARIA attributes
6. **Mobile first** - Test on mobile devices
7. **Progressive enhancement** - Ensure basic functionality without JavaScript

## Advanced Features

### Custom Completion Pages

Create custom completion pages with dynamic content:

```svelte
{#if isCompleted}
  <GovUKPage title="Success">
    {#snippet children()}
      <Panel 
        title="Application complete"
        body="Reference: {state.data.referenceNumber}"
      />
    {/snippet}
  </GovUKPage>
{/if}
```

### Data Persistence

Add localStorage persistence:

```typescript
onMount(() => {
  const saved = localStorage.getItem('journey-state');
  if (saved) {
    journeyStore.currentState = JSON.parse(saved);
  }
});

$effect(() => {
  localStorage.setItem('journey-state', JSON.stringify(state));
});
```

### Analytics

Track journey progress:

```typescript
$effect(() => {
  if (state.currentPageId) {
    analytics.track('page_view', {
      journey: journey.id,
      page: state.currentPageId,
      progress: journeyStore.progress
    });
  }
});
```
