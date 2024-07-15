import * as React from 'react';
import { KeytipLayer } from '@fluentui/react/lib/Keytips';
import type { Decorator } from '@storybook/react';

export const KeytipLayerWrapper: React.FunctionComponent<{}> = props => {
  return (
    <>
      <KeytipLayer content="Alt Windows" />
      {props.children}
    </>
  );
};

export const withKeytipLayer: Decorator = (storyFn, context) => {
  return <KeytipLayerWrapper>{storyFn(context)}</KeytipLayerWrapper>;
};
