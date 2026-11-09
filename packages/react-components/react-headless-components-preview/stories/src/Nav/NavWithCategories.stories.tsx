import * as React from 'react';
import {
  Nav,
  NavItem,
  NavSubItem,
  NavCategory,
  NavCategoryItem,
  NavSubItemGroup,
  NavDivider,
  NavSectionHeader,
} from '@fluentui/react-headless-components-preview/nav';
import { ChevronDownFilled } from '@fluentui/react-icons';

import styles from './nav.module.css';

export const WithCategories = (): React.ReactNode => {
  const [selectedValue, setSelectedValue] = React.useState('overview');
  const labels: Record<string, string> = {
    button: 'Button',
    input: 'Input',
    dialog: 'Dialog',
    useState: 'useState',
    useEffect: 'useEffect',
  };
  const currentPageDescription = labels[selectedValue] ? `Contains current page: ${labels[selectedValue]}` : undefined;

  return (
    <Nav
      selectedValue={selectedValue}
      onNavItemSelect={(_, data) => setSelectedValue(data.value)}
      defaultOpenCategories={['components']}
      className={styles.nav}
    >
      <NavSectionHeader className={styles.sectionHeader}>Documentation</NavSectionHeader>
      <NavItem value="overview" className={styles.navItem}>
        Overview
      </NavItem>

      <NavDivider className={styles.divider} />

      <NavCategory value="components">
        <NavCategoryItem
          className={styles.navCategoryItem}
          currentPageDescription={currentPageDescription}
          expandIcon={{ children: <ChevronDownFilled />, className: styles.expandIcon }}
        >
          Components
        </NavCategoryItem>
        <NavSubItemGroup>
          <NavSubItem value="button" className={styles.navSubItem}>
            Button
          </NavSubItem>
          <NavSubItem value="input" className={styles.navSubItem}>
            Input
          </NavSubItem>
          <NavSubItem value="dialog" className={styles.navSubItem}>
            Dialog
          </NavSubItem>
        </NavSubItemGroup>
      </NavCategory>

      <NavCategory value="hooks">
        <NavCategoryItem
          className={styles.navCategoryItem}
          currentPageDescription={currentPageDescription}
          expandIcon={{ children: <ChevronDownFilled />, className: styles.expandIcon }}
        >
          Hooks
        </NavCategoryItem>
        <NavSubItemGroup>
          <NavSubItem value="useState" className={styles.navSubItem}>
            useState
          </NavSubItem>
          <NavSubItem value="useEffect" className={styles.navSubItem}>
            useEffect
          </NavSubItem>
        </NavSubItemGroup>
      </NavCategory>
    </Nav>
  );
};

WithCategories.parameters = {
  docs: {
    description: {
      story: 'Supply a localized current-page description for a collapsed category containing the current destination.',
    },
  },
};
