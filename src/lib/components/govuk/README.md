# GOV.UK Design System Components

A comprehensive library of reusable Svelte components implementing the GOV.UK Design System.

## Available Components

### Layout & Content
- **Heading** - Headings with different sizes (xl, l, m, s)
- **Paragraph** - Body text with optional lead styling
- **Panel** - Confirmation panels for success messages
- **InsetText** - Highlighted text blocks
- **WarningText** - Warning messages with icon
- **Details** - Expandable/collapsible content

### Form Elements
- **Button** - Buttons with variants (default, secondary, warning, inverse, start)
- **TextInput** - Text input fields with labels, hints, and error messages
- **Textarea** - Multi-line text input
- **Radios** - Radio button groups
- **Checkboxes** - Checkbox groups
- **Select** - Dropdown select menus

### Data Display
- **Table** - Data tables with headers and rows
- **SummaryList** - Key-value lists with optional actions
- **Tag** - Status tags with color variants

## Usage

### Basic Import

```svelte
<script>
  import { Button, Heading, Paragraph } from '$lib/components/govuk';
</script>

<Heading text="Page Title" level="xl" tag="h1" />
<Paragraph text="Your content here" />
<Button text="Submit" onclick={() => console.log('Clicked!')} />
```

### Dynamic Rendering

Use the `componentMap` for dynamic component rendering from JSON:

```svelte
<script>
  import { componentMap, type ComponentConfig } from '$lib/components/govuk';

  const config: ComponentConfig[] = [
    {
      type: 'heading',
      props: { text: 'Dynamic Title', level: 'xl', tag: 'h1' }
    },
    {
      type: 'button',
      props: { text: 'Click me', variant: 'secondary' }
    }
  ];
</script>

{#each config as item}
  {@const Component = componentMap[item.type]}
  <Component {...item.props} />
{/each}
```

## Component Props

### Button
```typescript
{
  text: string;              // Button text
  href?: string;             // Optional link (renders as <a>)
  variant?: 'default' | 'secondary' | 'warning' | 'inverse';
  disabled?: boolean;
  startButton?: boolean;     // Adds arrow icon
  onclick?: () => void;
}
```

### Heading
```typescript
{
  text: string;
  level?: 'xl' | 'l' | 'm' | 's';  // Default: 'xl'
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';  // Default: 'h1'
}
```

### TextInput
```typescript
{
  id: string;
  name: string;
  label: string;
  hint?: string;
  error?: string;
  value?: string;            // Use bind:value for two-way binding
  type?: 'text' | 'email' | 'number' | 'tel';
  width?: '20' | '10' | '5' | '4' | '3' | '2';
  autocomplete?: string;
}
```

### Radios
```typescript
{
  id: string;
  name: string;
  legend: string;
  hint?: string;
  error?: string;
  options: Array<{
    value: string;
    text: string;
    hint?: string;
  }>;
  value?: string;            // Use bind:value for two-way binding
  inline?: boolean;
}
```

### Table
```typescript
{
  caption?: string;
  headers: string[];
  rows: Array<Record<string, string | number>>;
  firstCellIsHeader?: boolean;
}
```

### Tag
```typescript
{
  text: string;
  colour?: 'grey' | 'green' | 'turquoise' | 'blue' | 
           'purple' | 'pink' | 'red' | 'orange' | 'yellow';
}
```

### SummaryList
```typescript
{
  rows: Array<{
    key: string;
    value: string;
    actions?: Array<{
      href: string;
      text: string;
      visuallyHiddenText?: string;
    }>;
  }>;
  noBorder?: boolean;
}
```

## Examples

See the following pages for live examples:
- `/components` - Showcase of all components
- `/dynamic` - Dynamic rendering example

## TypeScript Support

All components are fully typed with TypeScript interfaces. Import types from the index:

```typescript
import type { ComponentConfig, ComponentType } from '$lib/components/govuk';
```

## Accessibility

All components follow GOV.UK Design System accessibility guidelines:
- Proper ARIA labels and descriptions
- Keyboard navigation support
- Screen reader friendly
- Error message associations
- Focus management
