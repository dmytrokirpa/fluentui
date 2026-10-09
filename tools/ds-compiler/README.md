# @fluentui/ds-compiler (spike)

Compiles **design-system recipes** into thin React wrappers over
`@fluentui/react-headless-components-preview` plus plain CSS.

## Fluent 2 first

This spike proves the compiler against Fluent 2 Button styles transcribed from
Griffel (`react-button`) and web-components CSS, targeting headless `data-*`
state attributes.

```bash
# from repo root
yarn ts-node --transpile-only tools/ds-compiler/src/cli/main.ts check
yarn ts-node --transpile-only tools/ds-compiler/src/cli/main.ts build
yarn nx run ds-compiler:test
```

Outputs land in `tools/ds-compiler/generated/fluent2/`.

See `docs/SPIKE.md` for exit criteria and findings.
