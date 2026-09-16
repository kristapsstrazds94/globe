"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

import { GlobeDataErrorState } from "@/components/ui/GlobeDataErrorState";

type GlobeErrorBoundaryProps = {
  children: ReactNode;
  onRetry: () => void;
};

type GlobeErrorBoundaryState = {
  hasError: boolean;
};

/**
 * Catches recoverable R3F/Three.js render failures without blanking the app shell.
 */
export class GlobeErrorBoundary extends Component<
  GlobeErrorBoundaryProps,
  GlobeErrorBoundaryState
> {
  state: GlobeErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): GlobeErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: ErrorInfo): void {
    if (process.env.NODE_ENV !== "production") {
      console.error("Globe render error:", error, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <GlobeDataErrorState
          title="Globe view interrupted"
          message="Something went wrong while rendering the globe. Try reloading the view, or use country search and the browse list in the meantime."
          onRetry={() => {
            this.setState({ hasError: false });
            this.props.onRetry();
          }}
        />
      );
    }

    return this.props.children;
  }
}
