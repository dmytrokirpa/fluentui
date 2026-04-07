import type { Alignment, AutoSize, Offset, OffsetFunctionParam, Position, PositioningShorthandValue } from '../types';
import { resolvePositioningShorthand } from './resolvePositioningShorthand';

/**
 * Maps a Fluent `position` + `align` pair to a CSS `position-area` value using logical keywords.
 * RTL is handled automatically by the browser via `inline-start`/`inline-end`.
 */
function toPositionArea(position: Position | undefined, align: Alignment | undefined): string {
  const pos = position ?? 'below';
  const ali = align ?? 'center';

  switch (pos) {
    case 'above':
      switch (ali) {
        case 'start':
          return 'block-start span-inline-start';
        case 'end':
          return 'block-start span-inline-end';
        default:
          return 'block-start center';
      }
    case 'below':
      switch (ali) {
        case 'start':
          return 'block-end span-inline-start';
        case 'end':
          return 'block-end span-inline-end';
        default:
          return 'block-end center';
      }
    case 'before':
      switch (ali) {
        case 'top':
          return 'span-block-start inline-start';
        case 'bottom':
          return 'span-block-end inline-start';
        default:
          return 'center inline-start';
      }
    case 'after':
      switch (ali) {
        case 'top':
          return 'span-block-start inline-end';
        case 'bottom':
          return 'span-block-end inline-end';
        default:
          return 'center inline-end';
      }
  }
}

/**
 * Given a shorthand fallback position value, returns the corresponding `position-area` CSS value.
 */
function shorthandToPositionArea(shorthand: PositioningShorthandValue): string {
  const resolved = resolvePositioningShorthand(shorthand);
  return toPositionArea(resolved.position, resolved.align);
}

/**
 * Returns the `margin-*` CSS property that represents the gap between the anchor and
 * the positioned element for a given position side.
 */
function offsetMarginProperty(position: Position | undefined): string {
  switch (position) {
    case 'above':
      return 'margin-block-end';
    case 'before':
      return 'margin-inline-end';
    case 'after':
      return 'margin-inline-start';
    case 'below':
    default:
      return 'margin-block-start';
  }
}

/**
 * Resolves an `Offset` value to a plain number (main axis only).
 * Function offsets are called with zeroed rects for the CSS path — callers that
 * need accurate rects should compute the value after layout and call `insert` again.
 */
function resolveOffsetMainAxis(offset: Offset | undefined): number {
  if (offset === undefined || offset === null) return 0;
  if (typeof offset === 'number') return offset;
  if (typeof offset === 'function') {
    const param: OffsetFunctionParam = {
      positionedRect: { width: 0, height: 0, x: 0, y: 0 },
      targetRect: { width: 0, height: 0, x: 0, y: 0 },
      position: 'below',
    };
    const result = offset(param);
    return typeof result === 'number' ? result : result.mainAxis;
  }
  return offset.mainAxis;
}

export interface BuildAnchorCSSOptions {
  anchorName: string;
  position?: Position;
  align?: Alignment;
  strategy?: 'absolute' | 'fixed';
  offset?: Offset;
  pinned?: boolean;
  fallbackPositions?: PositioningShorthandValue[];
  autoSize?: AutoSize;
  matchTargetSize?: 'width';
  coverTarget?: boolean;
}

/**
 * Builds the full CSS text for a single CSS Anchor Positioning instance.
 * Returns a string suitable for insertion into a CSSStyleSheet via `insertRule`.
 *
 * Because `insertRule` only accepts a single rule, and we may need multiple rules
 * (e.g. `@position-try` at-rules), the return is an array of rule strings to be
 * inserted in order.
 */
export function buildAnchorCSS(options: BuildAnchorCSSOptions): string[] {
  const {
    anchorName,
    position,
    align,
    strategy = 'absolute',
    offset,
    pinned,
    fallbackPositions,
    autoSize,
    matchTargetSize,
    coverTarget,
  } = options;

  const positionArea = toPositionArea(position, align);
  const mainAxisMargin = resolveOffsetMainAxis(offset);
  const marginProp = offsetMarginProperty(position);
  const selector = `[data-fui-anchor="${anchorName}"]`;

  const rules: string[] = [];

  // --- Custom @position-try rules for fallbackPositions ---
  const customTryNames: string[] = [];
  if (!pinned && fallbackPositions && fallbackPositions.length > 0) {
    fallbackPositions.forEach((shorthand, i) => {
      const tryName = `${anchorName}-try-${i}`;
      const tryArea = shorthandToPositionArea(shorthand);
      const resolved = resolvePositioningShorthand(shorthand);
      const tryMarginProp = offsetMarginProperty(resolved.position);
      const tryMarginValue = mainAxisMargin !== 0 ? `${tryMarginProp}: ${mainAxisMargin}px;` : '';
      rules.push(`@position-try ${tryName} { position-area: ${tryArea}; ${tryMarginValue} }`);
      customTryNames.push(tryName);
    });
  }

  // --- position-try-fallbacks ---
  let positionTryFallbacks = '';
  if (!pinned) {
    const allTries = [...customTryNames, 'flip-block', 'flip-inline', 'flip-block flip-inline'];
    positionTryFallbacks = `position-try-fallbacks: ${allTries.join(', ')};`;
  }

  // --- autoSize ---
  const autoSizeStyles: string[] = [];
  if (autoSize === true || autoSize === 'always') {
    autoSizeStyles.push('max-block-size: anchor-size(block, 100vh);');
    autoSizeStyles.push('max-inline-size: anchor-size(inline, 100vw);');
  } else if (autoSize === 'height' || autoSize === 'height-always') {
    autoSizeStyles.push('max-block-size: anchor-size(block, 100vh);');
  } else if (autoSize === 'width' || autoSize === 'width-always') {
    autoSizeStyles.push('max-inline-size: anchor-size(inline, 100vw);');
  }

  // --- matchTargetSize ---
  if (matchTargetSize === 'width') {
    autoSizeStyles.push('inline-size: anchor-size(inline);');
  }

  // --- offset margin ---
  const marginStyle = mainAxisMargin !== 0 ? `${marginProp}: ${mainAxisMargin}px;` : '';

  // --- coverTarget: position element over the anchor using anchor() edges ---
  let coverTargetStyle = '';
  if (coverTarget) {
    // Override position-area and use explicit anchor() edges to overlap the target.
    // This replaces the position-area declaration in the main rule.
    coverTargetStyle = `
  inset-block-start: anchor(block-start);
  inset-block-end: anchor(block-end);
  inset-inline-start: anchor(inline-start);
  inset-inline-end: anchor(inline-end);`;
  }

  // --- Main container rule ---
  const containerRule = `${selector} {
  position: ${strategy};
  position-anchor: ${anchorName};
  ${coverTarget ? '' : `position-area: ${positionArea};`}${coverTargetStyle}
  ${marginStyle}
  ${positionTryFallbacks}
  position-visibility: anchors-valid;
  ${autoSizeStyles.join('\n  ')}
}`;

  rules.push(containerRule);

  return rules;
}
