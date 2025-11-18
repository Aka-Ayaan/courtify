import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLogin from "./pages/user_login.jsx";
import UserSignup from "./pages/user_signup.jsx";
// import Dashboard from "./pages/dashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;