import { css } from '@microsoft/fast-element';
import { display } from '../utils/index.js';
import {
  colorNeutralBackground1,
  colorNeutralForeground1,
  fontFamilyBase,
  fontSizeBase300,
  fontSizeBase500,
  fontWeightRegular,
  fontWeightSemibold,
  lineHeightBase300,
  lineHeightBase500,
  spacingHorizontalXXL,
  spacingVerticalL,
  spacingVerticalS,
  spacingVerticalXXL,
} from '../theme/design-tokens.js';

/** Dialog Body styles
 * @public
 */
export const styles = css`
  ${display('grid')}

  :host {
    background: ${colorNeutralBackground1};
    box-sizing: border-box;
    gap: ${spacingVerticalS};
    padding: ${spacingVerticalXXL} ${spacingHorizontalXXL};
    container: dialog-body / inline-size;
  }

  .title {
    box-sizing: border-box;
    align-items: flex-start;
    background: ${colorNeutralBackground1};
    color: ${colorNeutralForeground1};
    column-gap: 8px;
    display: flex;
    font-family: ${fontFamilyBase};
    font-size: ${fontSizeBase500};
    font-weight: ${fontWeightSemibold};
    inset-block-start: 0;
    justify-content: space-between;
    line-height: ${lineHeightBase500};
    margin-block-end: calc(${spacingVerticalS} * -1);
    margin-block-start: calc(${spacingVerticalXXL} * -1);
    padding-block-end: ${spacingVerticalS};
    padding-block-start: ${spacingVerticalXXL};
  }

  .content {
    box-sizing: border-box;
    color: ${colorNeutralForeground1};
    font-family: ${fontFamilyBase};
    font-size: ${fontSizeBase300};
    font-weight: ${fontWeightRegular};
    line-height: ${lineHeightBase300};
    min-height: 32px;
  }

  .actions {
    box-sizing: border-box;
    background: ${colorNeutralBackground1};
    display: flex;
    flex-direction: column;
    gap: ${spacingVerticalS};
    inset-block-end: 0;
    margin-block-end: calc(${spacingVerticalXXL} * -1);
    padding-block-end: ${spacingVerticalXXL};
    padding-block-start: ${spacingVerticalL};
  }

  ::slotted([slot='title-action']) {
    margin-inline-start: auto;
  }

  ::slotted([slot='title']) {
    font: inherit;
    padding: 0;
    margin: 0;
  }

  /* align  title content to the end when there is no title*/
  :not(:has(:is([slot='title'], [slot='title-action']))) .title {
    justify-content: end;
  }

  @container (min-width: 480px) {
    .actions {
      align-items: center;
      flex-direction: row;
      justify-content: flex-end;
      margin-block-start: calc(${spacingVerticalS} * -1);
      padding-block-start: ${spacingVerticalS};
    }
  }

  /* For a11y, set sticky position for title and actions when the viewport is tall enough */
  @media (min-height: 480px) {
    .title {
      position: sticky;
      z-index: 1;
    }
    .actions {
      position: sticky;
      z-index: 2;
    }
`;
