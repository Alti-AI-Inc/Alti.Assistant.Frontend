'use client';
import React, { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Shown when a child crashes. Defaults to a minimal inline fallback. */
  fallback?: ReactNode;
  /** Optional label for log context (e.g. "WeatherWidget") */
  label?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Reusable React Error Boundary.
 * Wrap any widget/component to prevent a crash from cascading to the full page.
 *
 * Usage:
 *   <ErrorBoundary label="WeatherWidget">
 *     <WeatherWidget data={data} />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[ErrorBoundary${this.props.label ? `: ${this.props.label}` : ''}]`, error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-400">
          <span>⚠️ {this.props.label || 'Component'} failed to render</span>
          <button
            onClick={this.handleRetry}
            className="ml-auto rounded bg-red-500/10 px-2 py-0.5 text-red-300 hover:bg-red-500/20 transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
