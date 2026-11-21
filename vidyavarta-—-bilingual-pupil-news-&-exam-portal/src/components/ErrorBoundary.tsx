import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'An unexpected application error occurred.',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Portal ErrorBoundary caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F3] dark:bg-[#0E1116] text-[#171513] dark:text-[#F1F5F9] flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-white dark:bg-[#161B22] border border-stone-200 dark:border-slate-800 rounded-xl p-8">
            <p className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-semibold">
              Recovery Notice
            </p>
            <h1 className="text-2xl font-display font-semibold mt-2">
              Portal state interrupted
            </h1>
            <p className="text-sm text-stone-600 dark:text-slate-300 mt-3 leading-relaxed">
              {this.state.message}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 text-sm font-medium rounded-lg bg-[#1D4ED8] text-white hover:bg-[#1E40AF] transition-colors"
            >
              Reload Portal
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
