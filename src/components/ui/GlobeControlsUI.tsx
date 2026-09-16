"use client";

import type { ReactNode, SVGProps } from "react";

import {
  useGlobeControlsContext,
  type GlobeControlsApi,
} from "@/components/globe/GlobeControlsContext";

type IconDirection = "up" | "right" | "down" | "left";

const CHEVRON_ROTATION: Record<IconDirection, number> = {
  up: 180,
  right: -90,
  down: 0,
  left: 90,
};

function ChevronIcon({ direction }: { direction: IconDirection }) {
  return (
    <svg
      className="globe-controls__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ transform: `rotate(${CHEVRON_ROTATION[direction]}deg)` }}
    >
      <path d="M8 10l4 4 4-4" />
    </svg>
  );
}

function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="globe-controls__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function MinusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="globe-controls__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function ControlButton({
  label,
  iconOnly = false,
  children,
  onClick,
}: {
  label: string;
  iconOnly?: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={["globe-controls__button", iconOnly ? "globe-controls__button--icon" : ""]
        .filter(Boolean)
        .join(" ")}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function ControlGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="globe-controls__group" role="group" aria-label={label}>
      <span className="globe-controls__label">{label}</span>
      <div className="globe-controls__buttons">{children}</div>
    </div>
  );
}

/** Keyboard-accessible DOM controls for globe navigation (T014). */
export function GlobeControlsUI() {
  const { getApi } = useGlobeControlsContext();

  const invoke = (action: keyof GlobeControlsApi) => {
    getApi()?.[action]();
  };

  return (
    <nav className="globe-controls" aria-label="Globe navigation">
      <div className="globe-controls__panel">
        <ControlGroup label="Rotate">
          <div className="globe-controls__dpad">
            <span className="globe-controls__dpad-spacer" aria-hidden="true" />
            <ControlButton label="Rotate up" iconOnly onClick={() => invoke("rotateUp")}>
              <ChevronIcon direction="up" />
            </ControlButton>
            <span className="globe-controls__dpad-spacer" aria-hidden="true" />

            <ControlButton label="Rotate left" iconOnly onClick={() => invoke("rotateLeft")}>
              <ChevronIcon direction="left" />
            </ControlButton>
            <span className="globe-controls__dpad-center" aria-hidden="true" />
            <ControlButton label="Rotate right" iconOnly onClick={() => invoke("rotateRight")}>
              <ChevronIcon direction="right" />
            </ControlButton>

            <span className="globe-controls__dpad-spacer" aria-hidden="true" />
            <ControlButton label="Rotate down" iconOnly onClick={() => invoke("rotateDown")}>
              <ChevronIcon direction="down" />
            </ControlButton>
            <span className="globe-controls__dpad-spacer" aria-hidden="true" />
          </div>
        </ControlGroup>
        <ControlGroup label="Zoom">
          <div className="globe-controls__zoom">
            <ControlButton label="Zoom out" iconOnly onClick={() => invoke("zoomOut")}>
              <MinusIcon />
            </ControlButton>
            <ControlButton label="Zoom in" iconOnly onClick={() => invoke("zoomIn")}>
              <PlusIcon />
            </ControlButton>
          </div>
        </ControlGroup>
        <ControlGroup label="View">
          <ControlButton label="Reset view" onClick={() => invoke("reset")}>
            Reset
          </ControlButton>
        </ControlGroup>
      </div>
    </nav>
  );
}
