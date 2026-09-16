/**
 * Content-driven layout breakpoints (rem).
 * Keep in sync with CSS custom properties in `src/app/globals.css`.
 */
export const LAYOUT_BREAKPOINTS_REM = {
  mobileMax: 47.99,
  tabletMin: 48,
  tabletMax: 63.99,
  desktopMin: 64,
} as const;

/** Whether the viewport width matches the mobile layout tier. */
export function isMobileLayoutWidth(viewportWidthPx: number, rootFontSizePx = 16): boolean {
  return viewportWidthPx <= LAYOUT_BREAKPOINTS_REM.mobileMax * rootFontSizePx;
}

/** Whether the viewport width matches the tablet layout tier. */
export function isTabletLayoutWidth(viewportWidthPx: number, rootFontSizePx = 16): boolean {
  const widthRem = viewportWidthPx / rootFontSizePx;
  return (
    widthRem >= LAYOUT_BREAKPOINTS_REM.tabletMin && widthRem <= LAYOUT_BREAKPOINTS_REM.tabletMax
  );
}

/** Whether the viewport width matches the desktop layout tier. */
export function isDesktopLayoutWidth(viewportWidthPx: number, rootFontSizePx = 16): boolean {
  return viewportWidthPx >= LAYOUT_BREAKPOINTS_REM.desktopMin * rootFontSizePx;
}
