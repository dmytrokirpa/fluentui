import * as React from 'react';
import type { Decorator } from '@storybook/react';
import { AriaLiveAnnouncer } from '@fluentui/react-aria';

export const withAriaLive: Decorator = (storyFn, context) => {
  return <AriaLiveWrapper>{storyFn(context)}</AriaLiveWrapper>;
};

const AriaLiveWrapper: React.FC<{ children: React.ReactNode }> = props => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    // The AriaLiveAnnouncer appends an element to DOM in an effect
    // Trigger an extra renderer to make sure that doc examples that need to announce on mount can do so
    setMounted(true);
  }, []);
  return <AriaLiveAnnouncer>{mounted && props.children}</AriaLiveAnnouncer>;
};
