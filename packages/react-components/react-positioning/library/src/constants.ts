export const DATA_POSITIONING_INTERSECTING = 'data-popper-is-intersecting';
export const DATA_POSITIONING_ESCAPED = 'data-popper-escaped';
export const DATA_POSITIONING_HIDDEN = 'data-popper-reference-hidden';
export const DATA_POSITIONING_PLACEMENT = 'data-popper-placement';
export const POSITIONING_END_EVENT = 'fui-positioningend';

/**
 * HTML attribute placed on the container element by `createCSSAnchorPositionManager`.
 * Its value is the unique CSS custom property name used as the anchor name,
 * e.g. `data-fui-anchor="--fui-anchor-1"`.  The generated CSS rule targets this
 * attribute as a selector so that styles are scoped to a specific manager instance.
 */
export const DATA_FUI_ANCHOR = 'data-fui-anchor';

/**
 * CSS custom properties used to encode the slide direction for positioning-aware enter animations.
 * Set at runtime by `usePositioningSlideDirection` and registered via the CSS
 * `registerProperty()` API so browsers can interpolate them as `<length>` values.
 */
export const POSITIONING_SLIDE_DIRECTION_VAR_X = '--fui-positioning-slide-direction-x';
export const POSITIONING_SLIDE_DIRECTION_VAR_Y = '--fui-positioning-slide-direction-y';
