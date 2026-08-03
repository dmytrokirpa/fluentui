import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Calendar } from '@fluentui/react-components';
import type { CalendarProps } from '@fluentui/react-components';

export const Default = (props: CalendarProps): JSXElement => <Calendar {...props} />;
