"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";

import { formatBytes } from "@/lib/performance/formatBytes";
import { FrameStatsTracker } from "@/lib/performance/frameStats";
import { isPerfOverlayEnabled } from "@/lib/performance/isPerfOverlayEnabled";

type PerformanceMemory = {
  usedJSHeapSize: number;
  jsHeapSizeLimit: number;
};

function readPerformanceMemory(): PerformanceMemory | null {
  const memory = (performance as Performance & { memory?: PerformanceMemory }).memory;

  if (!memory) {
    return null;
  }

  return memory;
}

/** Dev-only FPS / frame-time overlay — enable with `?perf=1`. */
export function GlobePerfOverlay() {
  const enabledRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackerRef = useRef(new FrameStatsTracker());

  useEffect(() => {
    enabledRef.current = isPerfOverlayEnabled();

    if (!enabledRef.current) {
      return;
    }

    const container = document.createElement("div");
    container.className = "globe-perf-overlay";
    container.setAttribute("aria-hidden", "true");
    containerRef.current = container;
    document.body.appendChild(container);

    return () => {
      container.remove();
      containerRef.current = null;
    };
  }, []);

  useFrame(({ clock }) => {
    if (!enabledRef.current) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const sample = trackerRef.current.tick(clock.getElapsedTime() * 1000);
    if (!sample) {
      return;
    }

    const memory = readPerformanceMemory();
    const memoryLine =
      memory === null
        ? "Memory: unavailable (non-Chromium)"
        : `Memory: ${formatBytes(memory.usedJSHeapSize)} / ${formatBytes(memory.jsHeapSizeLimit)}`;

    container.textContent = [
      `FPS ${sample.fps}`,
      `Frame ${sample.frameTimeMs.toFixed(1)} ms (max ${sample.maxFrameTimeMs.toFixed(1)} ms)`,
      memoryLine,
      "Drag globe and hover countries while recording",
    ].join("\n");
  });

  return null;
}
