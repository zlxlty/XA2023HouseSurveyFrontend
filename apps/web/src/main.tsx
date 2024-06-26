import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import './styles/globals.css'
import * as Sentry from '@sentry/react'
import { initializeLC } from '#/utils/leancloud'
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router-dom'

initializeLC()

Sentry.init({
  dsn: 'https://42801978609b4e8eafa897ace2b42c39@sentry.mirroai.com/2',

  environment: import.meta.env.MODE,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 0.1,

  replaysSessionSampleRate: 0.001,

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    new Sentry.Replay({
      // Additional Replay configuration goes in here, for example:
      blockAllMedia: true,
    }),
    new Sentry.BrowserTracing({
      tracePropagationTargets: [/^https?:\/\/api\.mirroai\.com/, /^https?:\/\/lclambda\.mirro\.hyperex\.cc/],
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes
      ),
    })
  ],
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>,
)
