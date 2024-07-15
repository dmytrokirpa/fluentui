import * as React from 'react';
import { useStrictMode } from '../knobs/useStrictMode';
import type { Decorator } from '@storybook/react';

const StrictModeWrapper: React.FunctionComponent<{}> = props => {
  const strictMode = useStrictMode();
  return strictMode ? <React.StrictMode>{props.children}</React.StrictMode> : <>{props.children}</>;
};

export const withStrictMode: Decorator = (storyFn, context) => {
  return <StrictModeWrapper>{storyFn(context)}</StrictModeWrapper>;
};
