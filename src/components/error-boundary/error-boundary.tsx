import React, { ErrorInfo } from 'react';
import { ErrorViewer } from '../pdf-viewer/error-viewer';

type IErrorBoundaryState = {
	hasError: boolean;
}

export class ErrorBoundary extends React.Component {
	state: IErrorBoundaryState;

  constructor(props: unknown) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): IErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <ErrorViewer />;
    }

    return this.props.children; 
  }
}