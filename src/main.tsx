import App from './App.tsx'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import '@fontsource-variable/inter'
import '@xyflow/react/dist/style.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from '@/context/AuthContext.tsx'
import { NotificationProvider } from '@/context/NotificationContext.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
          {/* <ReactQueryDevtools /> */}
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  </React.StrictMode>,
);

// This is the preprod of the application.
