---
name: fluentui-react-v9
description: Documentation for Fluent UI React v9 (@fluentui/react-components) - Microsoft's React component library. Use when building React apps with Fluent UI, implementing Microsoft Fluent Design, working with @fluentui/react-components package, migrating from v8 or v0, customizing themes/styling, setting up SSR (Next.js/Remix), or implementing accessible React components following WCAG 2.1 AA standards.
---

# Fluent UI React v9 Skill

This skill provides comprehensive documentation for Fluent UI React v9 with 100+ React components, theming, accessibility, and migration guides.

**Package**: `@fluentui/react-components`

## Quick Reference

Install: `npm install @fluentui/react-components`

Basic usage:

```tsx
import { FluentProvider, webLightTheme, Button } from '@fluentui/react-components';
<FluentProvider theme={webLightTheme}>
  <Button appearance="primary">Click me</Button>
</FluentProvider>;
```

## How to Find Documentation

This skill contains 229 reference files organized by category. Follow this workflow to find what you need:

### Step 1: Identify the Category

**Components** (`components-*`) - Specific UI components (Button, Dialog, Menu, Table, etc.)
**Concepts** (`concepts-*`) - Core topics (styling, theming, SSR, accessibility)
**Migration** (`concepts-migration-*`) - Guides for migrating from v8 or v0
**Utilities** (`utilities-*`) - Helper functions and hooks
**Motion** (`motion-*`) - Animation and transition components

### Step 2: Search for the Documentation

Use the Grep tool to search reference files by pattern:

**For a specific component:**

```
Pattern: "components-{component-name}"
Example: "components-button" → reads "components-button-button.md"
```

**For subcomponents:**

```
Pattern: "components-{parent}-{child}"
Example: "components-table-tablecell"
```

**For concepts by topic:**

```
Pattern: "concepts-developer-{topic}"
Examples:
  - "concepts-developer-theming"
  - "concepts-developer-styling-components"
  - "concepts-developer-server-side-rendering-next-js"
```

**For migration guides:**

```
Pattern: "concepts-migration-from-{version}"
Examples:
  - "concepts-migration-from-v8-component-mapping"
  - "concepts-migration-from-v8-components-button-migration"
```

### Step 3: Read the Documentation

Once you find the file path, use the Read tool to load it. Each file contains:

- API reference with props, types, and defaults
- Code examples showing common patterns
- Best practices and accessibility guidelines
- Links to related documentation

### Step 4: If Documentation Not Found

If Grep returns no results:

1. Try variations: plural/singular, abbreviations, alternative names
2. Search for related terms in file content using Grep with `output_mode: "content"`
3. Check the "Working with AI" guide: `concepts-developer-working-with-ai`

### Alternative: Online Documentation Access

Documentation is also available online (updated with each release):

**Comprehensive index**: https://storybooks.fluentui.dev/react/llms.txt

**Individual pages**: https://storybooks.fluentui.dev/react/llms/{filename}.md

- Example: https://storybooks.fluentui.dev/react/llms/components-button-button.md

Use local reference files (via Grep/Read) as the primary method for speed and reliability. Use WebFetch on online URLs only when:

- Local files are unavailable
- You need to verify against the absolute latest version
- Checking for recent updates or changes

## Common Documentation Paths

**Styling and Theming:**

- Styling components: `concepts-developer-styling-components`
- Theming system: `concepts-developer-theming`
- Advanced styling: `concepts-developer-advanced-styling-techniques`
- Design tokens: Use Grep for "design tokens" or "theme tokens"

**Server-Side Rendering:**

- Next.js App Router: `concepts-developer-server-side-rendering-next-js-appdir-setup`
- Next.js Pages: `concepts-developer-server-side-rendering-next-js-pages-setup`
- Remix/React Router: `concepts-developer-server-side-rendering-react-router-7-and-remix-setup`

**Accessibility:**

- Overview: `concepts-developer-accessibility-components-overview`
- Focus indicators: `concepts-developer-accessibility-focus-indicator`
- Component labelling: `concepts-developer-accessibility-component-labelling`
- Per-component: `concepts-developer-accessibility-components-{name}`

**Migration from v8:**

- Component mapping: `concepts-migration-from-v8-component-mapping`
- Color mapping: `concepts-migration-from-v8-color-mapping`
- Specific component: `concepts-migration-from-v8-components-{name}-migration`

**Migration from v0 (Northstar):**

- Specific component: `concepts-migration-from-v0-components-{name}-migration`

## Frequently Used Components

When users mention these terms, search for the corresponding documentation:

Button, Input, Dialog, Menu, Dropdown, Checkbox, Radio/RadioGroup, Table, DataGrid, Accordion, Avatar, Badge, Card, Combobox, Divider, Label, Link, MessageBar, Popover, Select, Spinner, Switch, Tabs, Tag, Textarea, Toast, Toolbar, Tooltip, Tree

## Important Principles

**Always wrap apps in FluentProvider** - Required for theme context
**Use built-in variants first** - Check `appearance`, `size`, `shape` props before custom styling
**Maintain accessibility** - All components are WCAG 2.1 AA compliant by default
**Use design tokens** - Reference theme tokens instead of hard-coding colors
