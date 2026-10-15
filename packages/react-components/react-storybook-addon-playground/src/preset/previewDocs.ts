import type { Preview } from '@storybook/react-webpack5';

import { PlaygroundCanvas } from '../docs/PlaygroundCanvas';

/**
 * Registered only when `@storybook/addon-docs` is installed. Storybook 10 honors this Canvas override in autodocs and
 * MDX; on 9.1 it is ignored and the decorator's fallback adds the button instead.
 */
export const parameters: Preview['parameters'] = {
  docs: {
    components: {
      Canvas: PlaygroundCanvas,
    },
  },
};
