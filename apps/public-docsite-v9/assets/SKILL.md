# Fluent UI React v9 Skill

Fluent UI React v9 is Microsoft's official React component library implementing the Fluent Design System. This skill provides comprehensive documentation for 100+ production-ready components, theming, accessibility, and migration guides.

## Installation

```bash
npm install @fluentui/react-components

# or

yarn add @fluentui/react-components
```

## Quick Start

```tsx
import { FluentProvider, webLightTheme, Button } from '@fluentui/react-components';

function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <Button appearance="primary">Click me</Button>
    </FluentProvider>
  );
}
```

## Documentation Structure

The documentation is organized into these categories:

### 1. Components (components-\*)

Browse component documentation by searching for `components-[name]` files. Each component includes:

- Props and API reference
- Multiple usage examples with code
- Best practices and accessibility guidelines
- Common patterns and variations

**Common components**: Button, Input, Dialog, Menu, Dropdown, Checkbox, RadioGroup, Table, DataGrid, Accordion, Avatar, Badge, Card, Combobox, Divider, Label, Link, MessageBar, Popover, Select, Spinner, Switch, Tabs, Tag, Textarea, Toast, Toolbar, Tooltip, Tree

### 2. Concepts (concepts-\*)

Foundational documentation covering:

- **Quick Start** (concepts-developer-quick-start): Getting started guide
- **Styling** (concepts-developer-styling-components): How to style components with Griffel CSS-in-JS
- **Theming** (concepts-developer-theming): Customizing themes and design tokens
- **Positioning** (concepts-developer-positioning-components): Positioning utilities
- **SSR** (concepts-developer-server-side-rendering-\*): Next.js, Remix, React Router setup
- **Accessibility** (concepts-developer-accessibility-\*): WCAG 2.1 AA patterns and best practices
- **Advanced** (concepts-developer-advanced-\*): Advanced configuration, styling techniques, slots

### 3. Migration Guides (concepts-migration-\*)

Step-by-step migration guides:

- **From v8**: Component mapping, color mapping, breaking changes
- **From v0 (Northstar)**: Component-by-component migration guides
- Search for specific components: `concepts-migration-from-v8-components-[name]-migration`

### 4. Utilities (utilities-\*)

Helper utilities for focus management, theme utilities, and more.

### 5. Motion (motion-\*)

Animation components and APIs for creating smooth transitions and effects.

## How to Use This Skill

### Finding Component Documentation

1. **To use a component**: Search for `components-[component-name]` (e.g., `components-button`)
2. **For subcomponents**: Search for `components-[parent]-[child]` (e.g., `components-table-tablecell`)
3. **Read the props table**: Every component doc includes comprehensive props with types, defaults, and descriptions
4. **Review examples**: Multiple examples show common usage patterns

### Common Tasks

**Styling a component:**

```tsx
import { makeStyles, Button } from '@fluentui/react-components';

const useStyles = makeStyles({
  customButton: {
    backgroundColor: 'red',
    ':hover': { backgroundColor: 'darkred' },
  },
});

function MyButton() {
  const styles = useStyles();
  return <Button className={styles.customButton}>Styled Button</Button>;
}
```

See: concepts-developer-styling-components

**Creating a custom theme:**

```tsx
import { FluentProvider, createLightTheme, BrandVariants } from '@fluentui/react-components';

const myBrand: BrandVariants = {
  10: '#020305', // ... define all tokens
};

const myTheme = createLightTheme(myBrand);
```

See: concepts-developer-theming

**Migrating from v8:**

1. Check component mapping: concepts-migration-from-v8-component-mapping
2. Find specific migration guide: concepts-migration-from-v8-components-[name]-migration
3. Review breaking changes: concepts-migration-handling-breaking-changes

**SSR Setup:**

- Next.js App Router: concepts-developer-server-side-rendering-next-js-appdir-setup
- Next.js Pages: concepts-developer-server-side-rendering-next-js-pages-setup
- React Router/Remix: concepts-developer-server-side-rendering-react-router-7-and-remix-setup

**Accessibility:**

- Component labelling: concepts-developer-accessibility-component-labelling
- Focus indicators: concepts-developer-accessibility-focus-indicator
- Component-specific a11y: concepts-developer-accessibility-components-[name]

## Best Practices

1. **Always wrap your app in FluentProvider** with a theme
2. **Use semantic HTML**: Fluent components use proper ARIA attributes
3. **Prefer built-in variants**: Use `appearance`, `size`, `shape` props before custom styling
4. **Follow WCAG 2.1 AA**: All components are compliant by default, maintain this in customizations
5. **Use design tokens**: Reference theme tokens instead of hard-coding colors
6. **Test SSR**: If using SSR, follow framework-specific setup guides

## When to Use This Skill

- Building React applications with Fluent UI
- Implementing Microsoft Fluent Design System
- Migrating from @fluentui/react (v8) or @fluentui/react-northstar (v0)
- Need accessible, themeable UI components
- Working with Next.js, Remix, or React Router SSR
- Customizing Microsoft design language
- Building enterprise React applications
