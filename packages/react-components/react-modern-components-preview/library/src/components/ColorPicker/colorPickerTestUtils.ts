/**
 * Test-only helpers mirroring internal `@fluentui/react-color-picker` utilities.
 *
 * These values are not part of `@fluentui/react-color-picker`'s public API surface (its
 * `exports` map only exposes the package root), so Cypress component tests keep local copies
 * instead of deep-importing from the package's build output.
 */

export const INITIAL_COLOR_HSV = { h: 0, s: 0, v: 1, a: 1 };

function adjustToTransparency(value: number, transparency: boolean): number {
  return transparency ? 100 - value : value;
}

export function calculateTransparencyValue(transparency: boolean, value?: number): number | undefined {
  return value !== undefined ? adjustToTransparency(value * 100, transparency) : undefined;
}
