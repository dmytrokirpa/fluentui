import * as React from 'react';
import type { Preview } from '@storybook/react';
import { Provider, teamsTheme } from '@fluentui/react-northstar';

export default {
  parameters: { layout: 'none' },
  decorators: [
    (story, context) => {
      const isRtl = context.id.toLowerCase().includes('rtl');

      return (
        <Provider theme={teamsTheme} dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="testWrapper" style={{ width: '600px' }}>
            {story()}
          </div>
        </Provider>
      );
    },
  ];
} satisfies Preview;
