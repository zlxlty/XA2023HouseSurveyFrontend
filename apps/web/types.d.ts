/// <reference types="vite/client" />

declare module 'vite/client' {
  interface ImportMetaEnv {
    VITE_PUBLIC_HOST: string
  }
}