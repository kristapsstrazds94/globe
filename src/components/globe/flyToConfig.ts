import { easeInOutCubic } from "@/lib/globe/cameraFlyTo";

/** Camera fly-to tuning for country selection (T034). */
export const GLOBE_CAMERA_FLY_TO = {
  /** Default transition duration per docs/DESIGN.md. */
  durationMs: 750,
  /** Snap instantly when reduced motion is enabled. */
  reducedMotionDurationMs: 0,
  easing: easeInOutCubic,
} as const;
