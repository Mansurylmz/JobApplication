import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/index.scss"
import App from './App.jsx'
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import store from './redux/store.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <App />
    <ToastContainer/>
    </Provider>
  </StrictMode>,
)
