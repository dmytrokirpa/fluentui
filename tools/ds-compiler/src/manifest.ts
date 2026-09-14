/**
 * Headless manifests: slots + data-* state attrs a recipe may target.
 * Hand-authored from headless sources for the spike; later extract from .d.ts.
 */

export type PresenceAttr = { kind: 'presence'; attr: string };
export type EnumAttr = {
  kind: 'enum';
  attr: string;
  values: string[];
  /** Map recipe enum keys → DOM attribute values. Use '' for empty-string (checked=true). */
  attrValues?: Record<string, string>;
};
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

/**
 * Sourced from react-headless-components-preview Checkbox:
 * data-disabled, data-checked ('' | 'mixed'), data-label-position
 */
export const checkboxManifest: HeadlessManifest = {
  component: 'Checkbox',
  subpath: 'checkbox',
  packageName: '@fluentui/react-headless-components-preview',
  slots: ['root', 'label', 'input', 'indicator'],
  states: {
    disabled: { kind: 'presence', attr: 'data-disabled' },
    checked: {
      kind: 'enum',
      attr: 'data-checked',
      values: ['true', 'mixed'],
      // Headless writes '' for checked=true via toDataAttributeValue(true).
      attrValues: { true: '', mixed: 'mixed' },
    },
    labelPosition: { kind: 'enum', attr: 'data-label-position', values: ['before', 'after'] },
  },
  hooks: { use: 'useCheckbox', render: 'renderCheckbox' },
  types: { props: 'CheckboxProps', state: 'CheckboxState', slots: 'CheckboxSlots' },
};

/**
 * Menu is a headless family sharing subpath `menu`. Visual parts each get a recipe.
 * MenuPopover: no data-* states (surface only).
 */
export const menuPopoverManifest: HeadlessManifest = {
  component: 'MenuPopover',
  subpath: 'menu',
  packageName: '@fluentui/react-headless-components-preview',
  slots: ['root'],
  states: {},
  hooks: { use: 'useMenuPopover', render: 'renderMenuPopover' },
  types: { props: 'MenuPopoverProps', state: 'MenuPopoverState', slots: 'MenuPopoverSlots' },
};

/**
 * MenuItem: data-disabled, data-has-submenu, data-submenu-open
 */
export const menuItemManifest: HeadlessManifest = {
  component: 'MenuItem',
  subpath: 'menu',
  packageName: '@fluentui/react-headless-components-preview',
  slots: ['root', 'icon', 'checkmark', 'submenuIndicator', 'content', 'secondaryContent', 'subText'],
  states: {
    disabled: { kind: 'presence', attr: 'data-disabled' },
    hasSubmenu: { kind: 'presence', attr: 'data-has-submenu' },
    submenuOpen: { kind: 'presence', attr: 'data-submenu-open' },
  },
  hooks: { use: 'useMenuItem', render: 'renderMenuItem' },
  types: { props: 'MenuItemProps', state: 'MenuItemState', slots: 'MenuItemSlots' },
};

export const menuDividerManifest: HeadlessManifest = {
  component: 'MenuDivider',
  subpath: 'menu',
  packageName: '@fluentui/react-headless-components-preview',
  slots: ['root'],
  states: {},
  hooks: { use: 'useMenuDivider', render: 'renderMenuDivider' },
  types: { props: 'MenuDividerProps', state: 'MenuDividerState', slots: 'MenuDividerSlots' },
};

export const menuGroupHeaderManifest: HeadlessManifest = {
  component: 'MenuGroupHeader',
  subpath: 'menu',
  packageName: '@fluentui/react-headless-components-preview',
  slots: ['root'],
  states: {},
  hooks: { use: 'useMenuGroupHeader', render: 'renderMenuGroupHeader' },
  types: {
    props: 'MenuGroupHeaderProps',
    state: 'MenuGroupHeaderState',
    slots: 'MenuGroupHeaderSlots',
  },
};

/**
 * MenuItemCheckbox: MenuItem states + data-checked (presence; '' when true).
 */
export const menuItemCheckboxManifest: HeadlessManifest = {
  component: 'MenuItemCheckbox',
  subpath: 'menu',
  packageName: '@fluentui/react-headless-components-preview',
  slots: ['root', 'icon', 'checkmark', 'content', 'secondaryContent', 'subText'],
  states: {
    disabled: { kind: 'presence', attr: 'data-disabled' },
    hasSubmenu: { kind: 'presence', attr: 'data-has-submenu' },
    submenuOpen: { kind: 'presence', attr: 'data-submenu-open' },
    checked: { kind: 'presence', attr: 'data-checked' },
  },
  hooks: { use: 'useMenuItemCheckbox', render: 'renderMenuItemCheckbox' },
  types: {
    props: 'MenuItemCheckboxProps',
    state: 'MenuItemCheckboxState',
    slots: 'MenuItemSlots',
  },
};

/**
 * MenuItemRadio: same contract as MenuItemCheckbox (exclusive selection).
 */
export const menuItemRadioManifest: HeadlessManifest = {
  component: 'MenuItemRadio',
  subpath: 'menu',
  packageName: '@fluentui/react-headless-components-preview',
  slots: ['root', 'icon', 'checkmark', 'content', 'secondaryContent', 'subText'],
  states: {
    disabled: { kind: 'presence', attr: 'data-disabled' },
    hasSubmenu: { kind: 'presence', attr: 'data-has-submenu' },
    submenuOpen: { kind: 'presence', attr: 'data-submenu-open' },
    checked: { kind: 'presence', attr: 'data-checked' },
  },
  hooks: { use: 'useMenuItemRadio', render: 'renderMenuItemRadio' },
  types: {
    props: 'MenuItemRadioProps',
    state: 'MenuItemRadioState',
    slots: 'MenuItemSlots',
  },
};

export const labelManifest: HeadlessManifest = {
  component: 'Label',
  subpath: 'label',
  packageName: '@fluentui/react-headless-components-preview',
  slots: ['root', 'required'],
  states: {
    disabled: { kind: 'presence', attr: 'data-disabled' },
    required: { kind: 'presence', attr: 'data-required' },
  },
  hooks: { use: 'useLabel', render: 'renderLabel' },
  types: { props: 'LabelProps', state: 'LabelState', slots: 'LabelSlots' },
};

export const linkManifest: HeadlessManifest = {
  component: 'Link',
  subpath: 'link',
  packageName: '@fluentui/react-headless-components-preview',
  slots: ['root'],
  states: {
    disabled: { kind: 'presence', attr: 'data-disabled' },
    disabledFocusable: { kind: 'presence', attr: 'data-disabled-focusable' },
  },
  hooks: { use: 'useLink', render: 'renderLink' },
  types: { props: 'LinkProps', state: 'LinkState', slots: 'LinkSlots' },
};

export const toggleButtonManifest: HeadlessManifest = {
  component: 'ToggleButton',
  subpath: 'toggle-button',
  packageName: '@fluentui/react-headless-components-preview',
  slots: ['root', 'icon'],
  states: {
    disabled: { kind: 'presence', attr: 'data-disabled' },
    disabledFocusable: { kind: 'presence', attr: 'data-disabled-focusable' },
    iconOnly: { kind: 'presence', attr: 'data-icon-only' },
    checked: { kind: 'presence', attr: 'data-checked' },
    iconPosition: { kind: 'enum', attr: 'data-icon-position', values: ['before', 'after'] },
  },
  hooks: { use: 'useToggleButton', render: 'renderToggleButton' },
  types: { props: 'ToggleButtonProps', state: 'ToggleButtonState', slots: 'ToggleButtonSlots' },
};

export const switchManifest: HeadlessManifest = {
  component: 'Switch',
  subpath: 'switch',
  packageName: '@fluentui/react-headless-components-preview',
  slots: ['root', 'indicator', 'input', 'label'],
  states: {
    disabled: { kind: 'presence', attr: 'data-disabled' },
    disabledFocusable: { kind: 'presence', attr: 'data-disabled-focusable' },
    checked: { kind: 'presence', attr: 'data-checked' },
    labelPosition: { kind: 'enum', attr: 'data-label-position', values: ['before', 'after', 'above'] },
  },
  hooks: { use: 'useSwitch', render: 'renderSwitch' },
  types: { props: 'SwitchProps', state: 'SwitchState', slots: 'SwitchSlots' },
};

export const inputManifest: HeadlessManifest = {
  component: 'Input',
  subpath: 'input',
  packageName: '@fluentui/react-headless-components-preview',
  slots: ['root', 'input', 'contentBefore', 'contentAfter'],
  states: {
    disabled: { kind: 'presence', attr: 'data-disabled' },
    invalid: { kind: 'presence', attr: 'data-invalid' },
  },
  hooks: { use: 'useInput', render: 'renderInput' },
  types: { props: 'InputProps', state: 'InputState', slots: 'InputSlots' },
};

export const fieldManifest: HeadlessManifest = {
  component: 'Field',
  subpath: 'field',
  packageName: '@fluentui/react-headless-components-preview',
  slots: ['root', 'label', 'validationMessage', 'validationMessageIcon', 'hint'],
  states: {
    validationState: {
      kind: 'enum',
      attr: 'data-validate-state',
      values: ['error', 'warning', 'success', 'none'],
    },
  },
  hooks: { use: 'useField', render: 'renderField' },
  types: { props: 'FieldProps', state: 'FieldState', slots: 'FieldSlots' },
};

export const textareaManifest: HeadlessManifest = {
  component: 'Textarea',
  subpath: 'textarea',
  packageName: '@fluentui/react-headless-components-preview',
  slots: ['root', 'textarea'],
  states: {
    disabled: { kind: 'presence', attr: 'data-disabled' },
    invalid: { kind: 'presence', attr: 'data-invalid' },
    resize: {
      kind: 'enum',
      attr: 'data-resize',
      values: ['none', 'horizontal', 'vertical', 'both'],
    },
  },
  hooks: { use: 'useTextarea', render: 'renderTextarea' },
  types: { props: 'TextareaProps', state: 'TextareaState', slots: 'TextareaSlots' },
};

export const sliderManifest: HeadlessManifest = {
  component: 'Slider',
  subpath: 'slider',
  packageName: '@fluentui/react-headless-components-preview',
  slots: ['root', 'rail', 'thumb', 'input'],
  states: {
    disabled: { kind: 'presence', attr: 'data-disabled' },
    vertical: { kind: 'presence', attr: 'data-vertical' },
  },
  hooks: { use: 'useSlider', render: 'renderSlider' },
  types: { props: 'SliderProps', state: 'SliderState', slots: 'SliderSlots' },
};

export const spinnerManifest: HeadlessManifest = {
  component: 'Spinner',
  subpath: 'spinner',
  packageName: '@fluentui/react-headless-components-preview',
  slots: ['root', 'spinner', 'spinnerTail', 'label'],
  states: {
    labelPosition: {
      kind: 'enum',
      attr: 'data-label-position',
      values: ['before', 'after', 'above', 'below'],
    },
  },
  hooks: { use: 'useSpinner', render: 'renderSpinner' },
  types: { props: 'SpinnerProps', state: 'SpinnerState', slots: 'SpinnerSlots' },
};

/** Radio + RadioGroup share headless subpath `radio-group`. */
export const radioManifest: HeadlessManifest = {
  component: 'Radio',
  subpath: 'radio-group',
  packageName: '@fluentui/react-headless-components-preview',
  slots: ['root', 'label', 'input', 'indicator'],
  states: {
    disabled: { kind: 'presence', attr: 'data-disabled' },
    labelPosition: { kind: 'enum', attr: 'data-label-position', values: ['after', 'below'] },
  },
  hooks: { use: 'useRadio', render: 'renderRadio' },
  types: { props: 'RadioProps', state: 'RadioState', slots: 'RadioSlots' },
};

export const radioGroupManifest: HeadlessManifest = {
  component: 'RadioGroup',
  subpath: 'radio-group',
  packageName: '@fluentui/react-headless-components-preview',
  slots: ['root'],
  states: {},
  hooks: { use: 'useRadioGroup', render: 'renderRadioGroup' },
  types: { props: 'RadioGroupProps', state: 'RadioGroupState', slots: 'RadioGroupSlots' },
};

export const manifestsByComponent: Record<string, HeadlessManifest> = {
  Button: buttonManifest,
  Checkbox: checkboxManifest,
  MenuPopover: menuPopoverManifest,
  MenuItem: menuItemManifest,
  MenuItemCheckbox: menuItemCheckboxManifest,
  MenuItemRadio: menuItemRadioManifest,
  MenuDivider: menuDividerManifest,
  MenuGroupHeader: menuGroupHeaderManifest,
  Label: labelManifest,
  Link: linkManifest,
  ToggleButton: toggleButtonManifest,
  Switch: switchManifest,
  Input: inputManifest,
  Field: fieldManifest,
  Textarea: textareaManifest,
  Slider: sliderManifest,
  Spinner: spinnerManifest,
  Radio: radioManifest,
  RadioGroup: radioGroupManifest,
};

export function getManifest(component: string): HeadlessManifest {
  const manifest = manifestsByComponent[component];
  if (!manifest) {
    throw new Error(`No headless manifest for "${component}". Known: ${Object.keys(manifestsByComponent).join(', ')}`);
  }
  return manifest;
}
