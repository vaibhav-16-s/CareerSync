import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './globals.css';
import { Providers } from '@/providers';
import { ErrorBoundary } from '@/components/shared/error-boundary';
import Loading from '@/pages/Loading';
import App from './App';

// Replaces app/layout.tsx: <html>/<body> now live in index.html, and the
// Providers tree (theme -> query -> auth -> tooltip -> toaster) is mounted
// here, wrapped by the router so every route can navigate.
//
// ErrorBoundary + Suspense stand in for the Next.js error.tsx / loading.tsx
// conventions, which React Router does not provide automatically.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Providers>
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            <App />
          </Suspense>
        </ErrorBoundary>
      </Providers>
    </BrowserRouter>
  </React.StrictMode>
);
