import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StrictMode } from 'react'
import './index.css'
import Login from './auth/login.tsx';
import Register from './auth/register.tsx';
import { AppContextProvider } from './context/AppContextProvider.tsx';
import Me from './root/me.tsx';
import Navigation from './components/nav/navigation.tsx';
import Products from './root/products/products.tsx';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppContextProvider>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/me" element={<Me />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </BrowserRouter>
    </AppContextProvider>
  </StrictMode>,
)
