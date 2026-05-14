import { renderToastBody_unstable } from '@fluentui/react-toast';
import type { JSXElement } from '@fluentui/react-utilities';

import type { ToastBodyState } from './ToastBody.types';

export const renderToastBody = renderToastBody_unstable as (state: ToastBodyState) => JSXElement;
