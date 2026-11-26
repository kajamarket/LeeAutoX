import { Component, type ErrorInfo, type ReactNode } from 'react';

interface CarErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  onError?: () => void;
}

interface CarErrorBoundaryState {
  hasError: boolean;
}

export default class CarErrorBoundary extends Component<
  CarErrorBoundaryProps,
  CarErrorBoundaryState
> {
  state: CarErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): CarErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo): void {
    this.props.onError?.();
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
