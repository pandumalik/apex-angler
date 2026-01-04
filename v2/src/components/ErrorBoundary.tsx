import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
                    <div className="max-w-xl w-full bg-white rounded-lg shadow-xl p-8 border border-red-200">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong.</h1>
                        <div className="bg-slate-100 p-4 rounded overflow-auto mb-4 text-sm font-mono text-slate-800">
                            <p className="font-bold text-red-800 mb-2">{this.state.error && this.state.error.toString()}</p>
                            <pre>{this.state.errorInfo?.componentStack}</pre>
                        </div>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700"
                        >
                            Go Home
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
