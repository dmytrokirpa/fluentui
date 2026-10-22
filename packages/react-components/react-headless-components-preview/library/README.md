# @fluentui/react-headless-components-preview

**React Headless Components for [Fluent UI React](https://react.fluentui.dev/)**

> [!WARNING] > **This package is in preview and not production-ready.** APIs may change without notice before final release. **Do not use in production.**
>
> This package exposes unstyled, headless Fluent UI v9 primitives for teams building custom design systems. For most teams, [`@fluentui/react-components`](https://www.npmjs.com/package/@fluentui/react-components) remains the recommended default.

## State selector contract

Headless components expose resolved interaction and structural state through `data-*` attributes. Consumers that wrap these components, including visual-system packages, must preserve the attributes on the slot where headless emits them.

Existing attributes retain their current names and value semantics. Visual axes such as appearance, size, and shape are intentionally not part of the headless contract.

## Calendar tests

[Calendar.test.tsx](./src/components/Calendar/Calendar.test.tsx) covers the assembled Calendar and picker coordination.
Standalone picker behavior and grid contracts live in [CalendarDay.test.tsx](./src/components/Calendar/CalendarDay/CalendarDay.test.tsx), [CalendarMonth.test.tsx](./src/components/Calendar/CalendarMonth/CalendarMonth.test.tsx), and [CalendarYear.test.tsx](./src/components/Calendar/CalendarYear/CalendarYear.test.tsx), with local fixtures and assertions.
