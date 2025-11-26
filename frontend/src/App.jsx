import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Authcontext.jsx";
import Dashboard from "./pages/dashboard.jsx";
import "./styles/global.css";

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;