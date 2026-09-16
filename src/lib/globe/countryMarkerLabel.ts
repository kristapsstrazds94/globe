import { CanvasTexture, LinearFilter, SRGBColorSpace, SpriteMaterial } from "three";

import { COUNTRY_MARKER } from "@/components/globe/markerConfig";

export type CountryLabelLayout = {
  width: number;
  height: number;
};

type TextWidthMeasurer = (text: string, font: string) => number;

function defaultTextWidth(text: string, fontSize: number): number {
  return text.length * fontSize * 0.58;
}

/** Device pixel ratio for crisp canvas labels (CSS layout pixels × ratio = texture pixels). */
export function getCountryLabelPixelRatio(): number {
  if (typeof window === "undefined") {
    return 2;
  }

  return Math.min(3, Math.max(2, window.devicePixelRatio));
}

/** Estimate canvas size for a country name label (testable without DOM). */
export function measureCountryLabelLayout(
  text: string,
  measureTextWidth: TextWidthMeasurer = (label, font) => {
    if (typeof document === "undefined") {
      const fontSize = COUNTRY_MARKER.label.fontSize;
      return defaultTextWidth(label, fontSize);
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
      return defaultTextWidth(label, COUNTRY_MARKER.label.fontSize);
    }

    context.font = font;
    return context.measureText(label).width;
  },
): CountryLabelLayout {
  const { paddingX, paddingY, fontSize, fontFamily, fontWeight, minWidth } = COUNTRY_MARKER.label;
  const font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  const textWidth = measureTextWidth(text, font);

  return {
    width: Math.max(minWidth, Math.ceil(textWidth + paddingX * 2)),
    height: fontSize + paddingY * 2,
  };
}

function drawLabelCanvas(
  context: CanvasRenderingContext2D,
  text: string,
  width: number,
  height: number,
): void {
  const {
    fontSize,
    fontFamily,
    fontWeight,
    textColor,
    backgroundColor,
    borderColor,
    borderWidth,
    borderRadius,
  } = COUNTRY_MARKER.label;

  context.clearRect(0, 0, width, height);
  context.fillStyle = backgroundColor;
  context.strokeStyle = borderColor;
  context.lineWidth = borderWidth;

  const inset = borderWidth / 2;
  const w = width - borderWidth;
  const h = height - borderWidth;

  context.beginPath();
  context.roundRect(inset, inset, w, h, borderRadius);
  context.fill();
  context.stroke();

  context.fillStyle = textColor;
  context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.fillText(text, width / 2, height / 2);
}

/** Build a billboard sprite material for a country name. Caller must dispose. */
export function createCountryLabelMaterial(text: string): SpriteMaterial {
  if (typeof document === "undefined") {
    throw new Error("createCountryLabelMaterial requires a browser document");
  }

  const layout = measureCountryLabelLayout(text);
  const pixelRatio = getCountryLabelPixelRatio();
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(layout.width * pixelRatio);
  canvas.height = Math.round(layout.height * pixelRatio);

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not create 2D canvas context for country label");
  }

  context.scale(pixelRatio, pixelRatio);
  drawLabelCanvas(context, text, layout.width, layout.height);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;

  const material = new SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: true,
    depthWrite: false,
  });

  material.userData.labelLayout = layout;

  return material;
}

export function disposeCountryLabelMaterial(material: SpriteMaterial): void {
  material.map?.dispose();
  material.dispose();
}

/**
 * World-space sprite scale that keeps the label at a constant screen size.
 * Pairs with default sizeAttenuation so zoom does not blur the texture.
 */
export function getCountryLabelWorldScale(
  distance: number,
  viewportHeight: number,
  cameraFovDegrees: number,
  layout: CountryLabelLayout,
): [number, number, number] {
  const vFov = (cameraFovDegrees * Math.PI) / 180;
  const visibleHeight = 2 * Math.tan(vFov / 2) * distance;
  const worldHeight = (layout.height / viewportHeight) * visibleHeight;
  const worldWidth = (layout.width / viewportHeight) * visibleHeight;

  return [worldWidth, worldHeight, 1];
}
