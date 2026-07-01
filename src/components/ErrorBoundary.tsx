import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import nyanCat from "@/assets/easter-egg-nyancat.gif";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#fbfbfd] px-6 text-ink-900">
          <div className="card max-w-md p-10 text-center">
            <img
              src={nyanCat}
              alt=""
              aria-hidden="true"
              className="mx-auto mb-5 h-20 w-auto rounded-xl shadow-[0_4px_16px_rgba(15,23,42,0.1)]"
            />
            <h1 className="text-2xl font-semibold tracking-[-0.02em]">
              Something went wrong
            </h1>
            <p className="mt-3 text-sm text-ink-600">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = import.meta.env.BASE_URL;
              }}
              className="btn-pill mt-6 inline-flex items-center justify-center bg-ink-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              Back to home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
