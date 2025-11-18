import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/userLogin.css";
import "../styles/global.css";

function UserLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try{
      const params = new URLSearchParams({ email, password });
      const response = await fetch(`http://localhost:5000/auth/validate?${params}`, {
        method: "GET",
      });

      const data = await response.json();
      
      if (response.ok && data.authenticated) {
        console.log("Login successful:", data);
        navigate("/dashboard");  // example redirect
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err)
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <div className="login-container">
        <h2>Admin Login</h2>
        <form onSubmit={login}>
          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Signup link below the form */}
        <p style={{ marginTop: "15px", textAlign: "center", fontSize: "0.9rem" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "var(--primary)", fontWeight: "bold" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default UserLogin;
