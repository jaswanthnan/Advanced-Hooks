import React, { Suspense, Component, ErrorInfo, ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Alert, Button, Spin } from 'antd';

// 1. Class-based Error Boundary
interface ClassErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ClassErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ClassErrorBoundary extends Component<ClassErrorBoundaryProps, ClassErrorBoundaryState> {
  constructor(props: ClassErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ClassErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ClassErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Alert message="Class Error Boundary Caught An Error" description={this.state.error?.message} type="error" />
      );
    }
    return this.props.children;
  }
}

// 2. react-error-boundary with Suspense fallback
interface FormErrorBoundaryProps {
  children: React.ReactNode;
}

const ErrorFallback = ({ error, resetErrorBoundary }: any) => {
  return (
    <div className="p-4" role="alert">
      <Alert
        message="Something went wrong in the form"
        description={error.message}
        type="error"
        showIcon
        action={
          <Button size="small" danger onClick={resetErrorBoundary}>
            Try again
          </Button>
        }
      />
    </div>
  );
};

export const FormErrorBoundary: React.FC<FormErrorBoundaryProps> = ({ children }) => {
  return (
    <ClassErrorBoundary>
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}}>
        <Suspense fallback={
          <div className="p-8 text-center">
            <Spin size="large" />
            <div className="mt-3 text-slate-500 font-medium">Loading form...</div>
          </div>
        }>
          {children}
        </Suspense>
      </ErrorBoundary>
    </ClassErrorBoundary>
  );
};
