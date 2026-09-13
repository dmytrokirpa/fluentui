import { defineSlotRecipe } from '../../../src/schema';

/**
 * Fluent 2 MenuItem recipe.
 *
 * Transcribed from:
 * - packages/react-components/react-menu/library/src/components/MenuItem/useMenuItemStyles.styles.ts
 *
 * Intentional differences from Griffel styles:
 * - Focus ring uses native `:focus-visible` (headless excludes tabster focus indicators).
 * - Icon filled/regular swap on hover is omitted (requires icon bundle classes).
 * - Parent-hover → child color overrides for icon/subText use root color inheritance
 *   (schema has no parent-hover→child combinator yet).
 */
export const menuItemRecipe = defineSlotRecipe({
  component: 'MenuItem',
  headless: 'menu',
  slots: ['root', 'icon', 'checkmark', 'submenuIndicator', 'content', 'secondaryContent', 'subText'],
  source: 'react-menu/useMenuItemStyles.styles.ts',

  base: {
    root: {
      borderRadius: '$borderRadiusMedium',
      position: 'relative',
      color: '$colorNeutralForeground2',
      backgroundColor: '$colorNeutralBackground1',
      padding: '$spacingVerticalSNudge',
      boxSizing: 'border-box',
      maxWidth: '290px',
      minHeight: '32px',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'start',
      fontSize: '$fontSizeBase300',
      cursor: 'pointer',
      gap: '4px',
      userSelect: 'none',
      outlineStyle: 'none',
      _hover: {
        backgroundColor: '$colorNeutralBackground1Hover',
        color: '$colorNeutralForeground2Hover',
        _forcedColors: {
          backgroundColor: 'Canvas',
          borderColor: 'Highlight',
          color: 'Highlight',
        },
      },
      _active: {
        backgroundColor: '$colorNeutralBackground1Pressed',
        color: '$colorNeutralForeground2Pressed',
      },
      _focusVisible: {
        outline: '$strokeWidthThick solid $colorStrokeFocus2',
        outlineOffset: '-2px',
        _forcedColors: {
          outlineColor: 'Highlight',
        },
      },
    },
    content: {
      paddingLeft: '2px',
      paddingRight: '2px',
      backgroundColor: 'transparent',
      flexGrow: 1,
    },
    secondaryContent: {
      paddingLeft: '2px',
      paddingRight: '2px',
      fontSize: '$fontSizeBase200',
      lineHeight: '$lineHeightBase300',
      color: '$colorNeutralForeground3',
      _hover: {
        color: '$colorNeutralForeground3Hover',
      },
      _focus: {
        color: '$colorNeutralForeground3Hover',
      },
    },
    icon: {
      width: '20px',
      height: '20px',
      fontSize: '20px',
      lineHeight: 0,
      alignItems: 'center',
      display: 'inline-flex',
      justifyContent: 'center',
      flexShrink: 0,
    },
    submenuIndicator: {
      width: '20px',
      height: '20px',
      fontSize: '20px',
      lineHeight: 0,
      alignItems: 'center',
      display: 'inline-flex',
      justifyContent: 'center',
    },
    checkmark: {
      width: '20px',
      height: '20px',
      fontSize: '20px',
      lineHeight: 0,
      alignItems: 'center',
      display: 'inline-flex',
      justifyContent: 'center',
      flexShrink: 0,
      marginTop: '2px',
    },
    subText: {
      fontSize: '$fontSizeBase200',
      color: '$colorNeutralForeground3',
    },
  },

  states: {
    submenuOpen: {
      root: {
        backgroundColor: '$colorNeutralBackground1Hover',
        color: '$colorNeutralForeground2Hover',
        _forcedColors: {
          backgroundColor: 'Canvas',
          color: 'Highlight',
        },
      },
    },
    disabled: {
      root: {
        color: '$colorNeutralForegroundDisabled',
        cursor: 'not-allowed',
        _hover: {
          color: '$colorNeutralForegroundDisabled',
          backgroundColor: '$colorNeutralBackground1',
        },
        _active: {
          color: '$colorNeutralForegroundDisabled',
          backgroundColor: '$colorNeutralBackground1',
        },
        _focus: {
          color: '$colorNeutralForegroundDisabled',
        },
        _forcedColors: {
          color: 'GrayText',
        },
      },
      subText: {
        color: '$colorNeutralForegroundDisabled',
        _forcedColors: {
          color: 'GrayText',
        },
      },
    },
    hasSubmenu: {
      // Structural only — no unique visual beyond submenuIndicator slot presence.
    },
  },
});
