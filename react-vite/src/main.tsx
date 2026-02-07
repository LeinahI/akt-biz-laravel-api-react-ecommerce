import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { StrictMode } from 'react'
import './index.css'
import { AppContextProvider } from './context/AppContextProvider.tsx';
import AppRoutes from './routes/approutes.tsx';
import { Toaster } from 'sonner';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppContextProvider>
      <BrowserRouter>
        <Toaster position='top-right' />
        <AppRoutes />
      </BrowserRouter>
    </AppContextProvider>
  </StrictMode>,
)
