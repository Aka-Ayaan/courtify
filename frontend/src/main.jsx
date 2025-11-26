import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx';
import Card from './components/VenueCard.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />

    {/* <BrowserRouter>
      <Card />
    </BrowserRouter> */}
  </StrictMode>,
);