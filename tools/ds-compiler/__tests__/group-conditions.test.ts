import { defineSlotRecipe } from '../src/schema';
import { getManifest } from '../src/manifest';
import { validateRecipe } from '../src/validate';
import { compileRecipe } from '../src/compile';
import { emitCss } from '../src/emit-css';
import { fluent2Preset } from '../design-systems/fluent2/preset';

/**
 * Tiny fixture recipe to lock `_groupHover` / `_groupActive` selector shapes.
 */
const fixture = defineSlotRecipe({
  component: 'MenuItem',
  headless: 'menu',
  slots: ['root', 'icon', 'subText'],
  base: {
    root: {
      color: '$colorNeutralForeground2',
      _hover: { color: '$colorNeutralForeground2Hover' },
    },
    icon: {
      _groupHover: { color: '$colorNeutralForeground2BrandSelected' },
    },
    subText: {
      _groupHover: { color: '$colorNeutralForeground3Hover' },
      _groupActive: { color: '$colorNeutralForeground3Pressed' },
    },
  },
});

describe('group conditions (_groupHover / _groupActive)', () => {
  const manifest = getManifest('MenuItem');

  it('validates', () => {
    expect(validateRecipe(fixture, fluent2Preset, manifest).filter(i => i.level === 'error')).toEqual([]);
  });

  it('emits parent-pseudo child selectors with disabled guards', () => {
    const css = emitCss(compileRecipe(fixture, fluent2Preset, manifest));
    expect(css).toContain(
      '.fui-MenuItem:not([data-disabled]):not([data-disabled-focusable]):hover .fui-MenuItem__icon',
    );
    expect(css).toContain(
      '.fui-MenuItem:not([data-disabled]):not([data-disabled-focusable]):hover .fui-MenuItem__subText',
    );
    expect(css).toContain(
      '.fui-MenuItem:not([data-disabled]):not([data-disabled-focusable]):active .fui-MenuItem__subText',
    );
    // Child-local hover must NOT be used for group styles
    expect(css).not.toContain('.fui-MenuItem__icon:not([data-disabled])');
  });
});
