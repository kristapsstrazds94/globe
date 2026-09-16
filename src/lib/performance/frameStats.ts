export type FrameStatsSample = {
  fps: number;
  frameTimeMs: number;
  maxFrameTimeMs: number;
};

const SAMPLE_INTERVAL_MS = 500;

/** Rolling FPS / frame-time tracker for dev overlays — no React state per frame. */
export class FrameStatsTracker {
  private lastTimestamp = 0;
  private frameCount = 0;
  private elapsedMs = 0;
  private maxFrameTimeMs = 0;

  tick(timestampMs: number): FrameStatsSample | null {
    if (this.lastTimestamp === 0) {
      this.lastTimestamp = timestampMs;
      return null;
    }

    const frameTimeMs = timestampMs - this.lastTimestamp;
    this.lastTimestamp = timestampMs;
    this.frameCount += 1;
    this.elapsedMs += frameTimeMs;
    this.maxFrameTimeMs = Math.max(this.maxFrameTimeMs, frameTimeMs);

    if (this.elapsedMs < SAMPLE_INTERVAL_MS) {
      return null;
    }

    const sample: FrameStatsSample = {
      fps: Math.round((this.frameCount * 1000) / this.elapsedMs),
      frameTimeMs: this.elapsedMs / this.frameCount,
      maxFrameTimeMs: this.maxFrameTimeMs,
    };

    this.frameCount = 0;
    this.elapsedMs = 0;
    this.maxFrameTimeMs = 0;

    return sample;
  }
}
