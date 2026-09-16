import {
  GLOBE_INTERACTION_MOTION,
  getFlyToDurationMsForAngle,
} from "@/lib/design/interactionMotion";
import { easeInOutCubic } from "@/lib/globe/cameraFlyTo";

/** Camera fly-to tuning for country selection (T034, T051). */
export const GLOBE_CAMERA_FLY_TO = {
  /** Shortest transition duration per docs/DESIGN.md. */
  durationMs: GLOBE_INTERACTION_MOTION.flyToMinMs,
  /** Longest transition at half-orbit travel. */
  maxDurationMs: GLOBE_INTERACTION_MOTION.flyToMaxMs,
  /** Snap instantly when reduced motion is enabled. */
  reducedMotionDurationMs: GLOBE_INTERACTION_MOTION.reducedMotionDurationMs,
  easing: easeInOutCubic,
} as const;

/** Fly-to duration scaled by travel angle — instant when reduced motion is preferred (T042). */
export function getFlyToDurationMs(prefersReducedMotion: boolean, angleRadians = 0): number {
  return getFlyToDurationMsForAngle(angleRadians, prefersReducedMotion);
}
