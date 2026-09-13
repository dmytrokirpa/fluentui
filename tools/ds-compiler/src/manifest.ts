/**
 * Headless manifests: slots + data-* state attrs a recipe may target.
 * Hand-authored from headless sources for the spike; later extract from .d.ts.
 */

export type PresenceAttr = { kind: 'presence'; attr: string };
export type EnumAttr = { kind: 'enum'; attr: string; values: string[] };
export type StateAttr = PresenceAttr | EnumAttr;

export type HeadlessManifest = {
  component: string;
  subpath: string;
  packageName: string;
  slots: string[];
  states: Record<string, StateAttr>;
  hooks: { use: string; render: string };
  types: { props: string; state: string; slots: string };
};

/**
 * Sourced from react-headless-components-preview Button:
 * data-disabled, data-disabled-focusable, data-icon-only, data-icon-position
 */
export const buttonManifest: HeadlessManifest = {
  component: 'Button',
  subpath: 'button',
  packageName: '@fluentui/react-headless-components-preview',
  slots: ['root', 'icon'],
  states: {
    disabled: { kind: 'presence', attr: 'data-disabled' },
    disabledFocusable: { kind: 'presence', attr: 'data-disabled-focusable' },
    iconOnly: { kind: 'presence', attr: 'data-icon-only' },
    iconPosition: { kind: 'enum', attr: 'data-icon-position', values: ['before', 'after'] },
  },
  hooks: { use: 'useButton', render: 'renderButton' },
  types: { props: 'ButtonProps', state: 'ButtonState', slots: 'ButtonSlots' },
};

export const manifestsByComponent: Record<string, HeadlessManifest> = {
  Button: buttonManifest,
};

export function getManifest(component: string): HeadlessManifest {
  const manifest = manifestsByComponent[component];
  if (!manifest) {
    throw new Error(`No headless manifest for "${component}". Known: ${Object.keys(manifestsByComponent).join(', ')}`);
  }
  return manifest;
}
