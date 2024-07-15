import * as React from 'react';
import { Decorator } from '@storybook/react';

import { STRICT_MODE_ID } from '../constants';

export const withReactStrictMode: Decorator = (storyFn, context) => {
  const isActive = context.globals[STRICT_MODE_ID] ?? false;

  return <StrictModeWrapper strictMode={isActive}>{storyFn(context)}</StrictModeWrapper>;
};

const StrictModeWrapper = (props: { strictMode: boolean; children: React.ReactElement }) => {
  return props.strictMode ? <React.StrictMode>{props.children}</React.StrictMode> : props.children;
};
