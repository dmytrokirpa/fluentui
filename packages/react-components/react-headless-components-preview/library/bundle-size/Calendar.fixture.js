// Named import of the composed component only: a namespace import keeps every export name as a string property in
// the minified output, which no consumer ships, and inflates the measured size.
import { Calendar } from '@fluentui/react-headless-components-preview/calendar';

console.log(Calendar);

export default {
  name: '@fluentui/react-headless-components-preview/calendar',
};
