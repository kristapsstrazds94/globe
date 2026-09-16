type HoverPointerListener = (x: number, y: number) => void;

let pointerX = 0;
let pointerY = 0;

const listeners = new Set<HoverPointerListener>();

/** Update the latest hover pointer position without triggering React renders. */
export function setHoverPointer(clientX: number, clientY: number): void {
  pointerX = clientX;
  pointerY = clientY;

  for (const listener of listeners) {
    listener(clientX, clientY);
  }
}

export function getHoverPointer(): { x: number; y: number } {
  return { x: pointerX, y: pointerY };
}

/** Subscribe to pointer moves for tooltip positioning. Returns an unsubscribe function. */
export function subscribeHoverPointer(listener: HoverPointerListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
