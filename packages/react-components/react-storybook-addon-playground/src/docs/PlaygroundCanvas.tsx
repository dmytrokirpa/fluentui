import * as React from 'react';
import { Canvas, useOf } from '@storybook/addon-docs/blocks';
import { useFluent } from '@fluentui/react-components';
import type { JSXElement } from '@fluentui/react-utilities';

import { getOpenInPlaygroundAction } from '../decorators/withOpenInPlaygroundButton';

/** Composes the public Canvas block instead of replacing Storybook's source controls. */
export const PlaygroundCanvas = (props: React.ComponentProps<typeof Canvas>): JSXElement => {
  const { story } = useOf(props.of ?? 'story', ['story']);
  const { targetDocument } = useFluent();
  // Scanning the story source for imports is not free; only redo it when the story changes.
  const action = React.useMemo(() => getOpenInPlaygroundAction(story, targetDocument, false), [story, targetDocument]);
  const existingActions = props.additionalActions ?? story.parameters.docs?.canvas?.additionalActions ?? [];

  return <Canvas {...props} additionalActions={action ? [...existingActions, action] : existingActions} />;
};
