/** Pointer, touch, and keyboard interaction tuning for globe controls (T014). */
export const GLOBE_CONTROLS = {
  /** Inertial damping when reduced motion is off. */
  dampingFactor: 0.08,
  rotateSpeed: 0.9,
  zoomSpeed: 1.0,
  /** Radians applied per keyboard arrow press or UI rotate step. */
  keyboardRotateStep: 0.08,
  /** Multiplier passed to OrbitControls dollyIn/dollyOut for keyboard and UI zoom. */
  keyboardZoomScale: 1.12,
} as const;

export type ControlsDampingSettings = {
  enableDamping: boolean;
  dampingFactor: number;
};

/** OrbitControls damping — disabled when reduced motion is preferred (T042). */
export function getControlsDampingSettings(prefersReducedMotion: boolean): ControlsDampingSettings {
  if (prefersReducedMotion) {
    return { enableDamping: false, dampingFactor: 0 };
  }

  return {
    enableDamping: true,
    dampingFactor: GLOBE_CONTROLS.dampingFactor,
  };
}
