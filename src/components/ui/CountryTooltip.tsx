"use client";

import { useEffect, useRef } from "react";

import { getCountryNameById } from "@/lib/globe/countryLookup";
import { getHoverPointer, subscribeHoverPointer } from "@/lib/globe/hoverPointer";
import { isHoverCapableDevice } from "@/lib/ui/hoverCapable";
import { computeTooltipPosition } from "@/lib/ui/tooltipPosition";
import { useGlobeStore } from "@/stores/globeStore";

/** HTML tooltip for hovered countries — pointer position updates bypass React render loop. */
export function CountryTooltip() {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hoveredCountryId = useGlobeStore((state) => state.hoveredCountryId);
  const selectedCountryId = useGlobeStore((state) => state.selectedCountryId);
  const countryName = hoveredCountryId ? getCountryNameById(hoveredCountryId) : null;
  const hoverCapable = isHoverCapableDevice();
  const visible = hoverCapable && countryName !== null && selectedCountryId === null;

  useEffect(() => {
    const tooltip = tooltipRef.current;
    if (!tooltip) {
      return;
    }

    const updatePosition = (clientX: number, clientY: number) => {
      const rect = tooltip.getBoundingClientRect();
      const position = computeTooltipPosition(
        clientX,
        clientY,
        rect.width,
        rect.height,
        window.innerWidth,
        window.innerHeight,
      );

      tooltip.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
    };

    const reposition = () => {
      const { x, y } = getHoverPointer();
      updatePosition(x, y);
    };

    reposition();
    const unsubscribe = subscribeHoverPointer(updatePosition);

    return unsubscribe;
  }, []);

  useEffect(() => {
    const tooltip = tooltipRef.current;
    if (!tooltip) {
      return;
    }

    tooltip.hidden = !visible;
    tooltip.setAttribute("aria-hidden", visible ? "false" : "true");

    if (visible) {
      const { x, y } = getHoverPointer();
      const rect = tooltip.getBoundingClientRect();
      const position = computeTooltipPosition(
        x,
        y,
        rect.width,
        rect.height,
        window.innerWidth,
        window.innerHeight,
      );
      tooltip.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
    }
  }, [visible]);

  return (
    <div
      ref={tooltipRef}
      className={`country-tooltip${visible ? " country-tooltip--visible" : ""}`}
      role="tooltip"
      aria-hidden="true"
      hidden
    >
      {countryName ?? ""}
    </div>
  );
}
