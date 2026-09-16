import { beforeEach, describe, expect, it } from "vitest";

import { useGlobeStore } from "@/stores/globeStore";

describe("globeStore selection", () => {
  beforeEach(() => {
    useGlobeStore.setState({
      hoveredCountryId: null,
      selectedCountryId: null,
      searchQuery: "",
      isPanelOpen: false,
    });
  });

  it("stores selected country id and opens the panel", () => {
    useGlobeStore.getState().setSelectedCountryId("NOR");

    const state = useGlobeStore.getState();
    expect(state.selectedCountryId).toBe("NOR");
    expect(state.isPanelOpen).toBe(true);
  });

  it("clears selection and closes the panel", () => {
    useGlobeStore.getState().setSelectedCountryId("NOR");
    useGlobeStore.getState().clearSelection();

    const state = useGlobeStore.getState();
    expect(state.selectedCountryId).toBeNull();
    expect(state.isPanelOpen).toBe(false);
  });

  it("does not re-render subscribers when hover id is unchanged", () => {
    useGlobeStore.getState().setHoveredCountryId("NOR");
    useGlobeStore.getState().setHoveredCountryId("NOR");

    expect(useGlobeStore.getState().hoveredCountryId).toBe("NOR");
  });
});
