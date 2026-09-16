"use client";

import {
  useGlobeControlsContext,
  type GlobeControlsApi,
} from "@/components/globe/GlobeControlsContext";

function ControlButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="globe-controls__button"
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

/** Keyboard-accessible DOM controls for globe navigation (T014). */
export function GlobeControlsUI() {
  const { getApi } = useGlobeControlsContext();

  const invoke = (action: keyof GlobeControlsApi) => {
    getApi()?.[action]();
  };

  return (
    <div
      className="globe-controls"
      role="toolbar"
      aria-label="Globe navigation"
    >
      <ControlButton
        label="Rotate left"
        onClick={() => invoke("rotateLeft")}
      />
      <ControlButton
        label="Rotate right"
        onClick={() => invoke("rotateRight")}
      />
      <ControlButton label="Rotate up" onClick={() => invoke("rotateUp")} />
      <ControlButton
        label="Rotate down"
        onClick={() => invoke("rotateDown")}
      />
      <ControlButton label="Zoom in" onClick={() => invoke("zoomIn")} />
      <ControlButton label="Zoom out" onClick={() => invoke("zoomOut")} />
      <ControlButton label="Reset view" onClick={() => invoke("reset")} />
    </div>
  );
}
