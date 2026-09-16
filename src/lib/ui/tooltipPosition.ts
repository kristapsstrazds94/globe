export type TooltipPosition = {
  x: number;
  y: number;
};

export const TOOLTIP_OFFSET = {
  x: 12,
  y: 16,
} as const;

export const TOOLTIP_VIEWPORT_PADDING = 8;

/** Place a fixed tooltip near the pointer while keeping it inside the viewport. */
export function computeTooltipPosition(
  clientX: number,
  clientY: number,
  tooltipWidth: number,
  tooltipHeight: number,
  viewportWidth: number,
  viewportHeight: number,
  offsetX = TOOLTIP_OFFSET.x,
  offsetY = TOOLTIP_OFFSET.y,
): TooltipPosition {
  const padding = TOOLTIP_VIEWPORT_PADDING;

  let x = clientX + offsetX;
  let y = clientY + offsetY;

  if (x + tooltipWidth + padding > viewportWidth) {
    x = clientX - tooltipWidth - offsetX;
  }

  if (y + tooltipHeight + padding > viewportHeight) {
    y = clientY - tooltipHeight - offsetY;
  }

  x = Math.max(padding, Math.min(x, viewportWidth - tooltipWidth - padding));
  y = Math.max(padding, Math.min(y, viewportHeight - tooltipHeight - padding));

  return { x, y };
}
