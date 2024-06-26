import { Button } from '@nextui-org/react';
import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react';
import { FC, ReactNode, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

interface SentryErrorData {
  error: Error
  componentStack: string
  eventId: string
  resetError(): void
}

export const ErrorBoundaryFallback: FC<SentryErrorData> = ({
  error, eventId,
}) => {
  const errorMessage = useMemo(() => {
    if (error?.message && typeof error.message === 'string') {
      return error.message
    }
    return '[未知错误]'
  }, [error])

  useEffect(() => { console.log(errorMessage) }, [errorMessage])
  return (
    <div className="h-full w-full flex items-center justify-center flex-col px-8">
      <h2 className="text-3xl font-bold text-gray-800">:D</h2>
      <p className="text-xl font-bold mt-2 -mr-1">你找到了一个新 Bug！</p>

      <p className="text-gray-500 mt-4 text-center text-sm">
        Mirro 于刚才遇到了一个错误 :(
      </p>
      <p className="text-gray-500 mt-2 text-center text-sm">
        Mirro 还在快速迭代中，我们会尽快修复这个问题。
      </p>
      <p className="text-gray-700 mt-4 text-center text-xs">
        您遇到的错误已由错误收集系统自动上报。向我们反馈时，您可提供下方的调试信息以帮助更快地定位问题。
      </p>

      <div className="mt-4 font-mono text-sm flex flex-col items-start justify-center rounded-2xl p-4 border border-solid border-gray-400 gap-1">
        <span className="text-gray-500">{eventId}</span>
        <span className="text-gray-500">{errorMessage}</span>
      </div>

      <Link to="/">
        <Button auto className="mt-4">
          返回首页
        </Button>
      </Link>

      <p className="text-gray-500 mt-16 text-center">
        Mirro AI Developers, with ❤️
      </p>
    </div>
  );
};

export const MirroErrorBoundary = ({ children }: { children?: ReactNode; }) => {
  return (
    <SentryErrorBoundary
      fallback={errorData => <ErrorBoundaryFallback {...errorData} />}
    >
      {children}
    </SentryErrorBoundary>
  );
};
