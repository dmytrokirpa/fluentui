import * as React from 'react';
import { NavContextValue } from './NavContext.types';

const navContextDefaultValue: NavContextValue = {
  reserveSelectedNavItemSpace: true,
  selectedValue: undefined,
  onRegister: () => {
    /* noop */
  },
  onUnregister: () => {
    /* noop */
  },
  onSelect: () => {
    /* noop */
  },
  getRegisteredNavItems: () => {
    return {
      registeredNavItems: {},
    };
  },
};

const NavContext = React.createContext<NavContextValue | undefined>(undefined);

export const NavProvider = NavContext.Provider;

export const useNavContext_unstable = () => React.useContext(NavContext) || navContextDefaultValue;