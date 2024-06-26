import PageLoading from '#/components/page-loading'
import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react'
import { FC, ReactNode, Suspense } from 'react'
import { ErrorBoundaryFallback } from './ErrorBoundaryFallback'

type NextShimProps = {
  Layout?: FC<{ children?: ReactNode }>
  Loading?: FC
}

export const wrapNextPage = (
  Page: FC,
  { Layout, Loading }: NextShimProps = {},
) => {
  const WrappedComponent: FC = () => {
    const loading = Loading ? <Loading /> : <PageLoading />

    const innerPage = (
      <SentryErrorBoundary
        fallback={errorData => <ErrorBoundaryFallback {...errorData} />}
      >
        <Page />
      </SentryErrorBoundary>
    )

    const page = Layout ? <Layout children={innerPage} /> : innerPage

    return (
      <SentryErrorBoundary
        fallback={errorData => <ErrorBoundaryFallback {...errorData} />}
      >
        <Suspense fallback={loading} children={page} />
      </SentryErrorBoundary>
    )
  }

  return WrappedComponent
}
