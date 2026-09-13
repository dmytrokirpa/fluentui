import type { SlotStyles, RecipeStateMap } from '../../../src/schema';

/**
 * Shared MenuItem slot styles (Fluent 2).
 * Used by MenuItem, MenuItemCheckbox, and MenuItemRadio recipes.
 */
export const menuItemBaseSlots: SlotStyles = {
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
    // Parent-hover → brand icon color (Griffel `& .icon` under `:hover`)
    _groupHover: {
      color: '$colorNeutralForeground2BrandSelected',
    },
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
    _groupHover: {
      color: '$colorNeutralForeground3Hover',
    },
    _groupActive: {
      color: '$colorNeutralForeground3Pressed',
    },
  },
};

export const menuItemSubmenuIndicatorSlot: SlotStyles = {
  submenuIndicator: {
    width: '20px',
    height: '20px',
    fontSize: '20px',
    lineHeight: 0,
    alignItems: 'center',
    display: 'inline-flex',
    justifyContent: 'center',
  },
};

export const menuItemInteractionStates: RecipeStateMap = {
  submenuOpen: {
    root: {
      backgroundColor: '$colorNeutralBackground1Hover',
      color: '$colorNeutralForeground2Hover',
      _forcedColors: {
        backgroundColor: 'Canvas',
        color: 'Highlight',
      },
    },
    icon: {
      color: '$colorNeutralForeground2BrandSelected',
    },
    subText: {
      color: '$colorNeutralForeground3Hover',
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
    icon: {
      color: '$colorNeutralForegroundDisabled',
      _groupHover: {
        color: '$colorNeutralForegroundDisabled',
      },
    },
    subText: {
      color: '$colorNeutralForegroundDisabled',
      _groupHover: {
        color: '$colorNeutralForegroundDisabled',
      },
      _groupActive: {
        color: '$colorNeutralForegroundDisabled',
      },
      _forcedColors: {
        color: 'GrayText',
      },
    },
  },
};
