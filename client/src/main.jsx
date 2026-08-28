import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom';
import Navbar from './common/Navbar.jsx';
import Footer from './common/Footer.jsx';
import { Provider } from 'react-redux';
import store from './redux/store.js';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Navbar/>
    <Provider store={store}>
      <App />
      </Provider>
      <Footer/>
    </BrowserRouter>
  </StrictMode>,
)
