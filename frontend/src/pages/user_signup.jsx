import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/userLogin.css";
import "../styles/global.css";

const formatPhoneNumber = (value) => {
  // Remove all non-digit characters except +
  let cleaned = value.replace(/[^\d+]/g, "");

  // Ensure it starts with +92
  if (!cleaned.startsWith("+92")) {
    cleaned = "+92" + cleaned.replace(/^\+?/, "");
  }

  // Add spaces after 3 and 6 digits following +92
  // +92 300 1234567
  if (cleaned.length > 3) {
    cleaned = cleaned.slice(0, 3) + " " + cleaned.slice(3);
  }
  if (cleaned.length > 7) {
    cleaned = cleaned.slice(0, 7) + " " + cleaned.slice(7, 15);
  }

  // Limit length to max 14 chars (+92 xxx xxxxxxx)
  return cleaned.slice(0, 15);
};

function UserSignup() {
  const navigate = useNavigate();

  // States for form fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");

  // Pakistan phone number regex: +92 xxx xxxxxxx
  const validatePhone = (number) => {
    const regex = /^\+92\s\d{3}\s\d{7}$/;
    return regex.test(number);
  };

  const signup = async (e) => {
    e.preventDefault();
    setError("");

    // Validate phone
    if (!validatePhone(phone)) {
      setPhoneError("Phone number must be in format +92 xxx xxxxxxx");
      return;
    } else {
      setPhoneError("");
    }

    // Validate password length
    if (password.length < 8) {
    setPasswordError("Password must be at least 8 characters long");
    return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    } else {
      setPasswordError("");
    }

    setLoading(true);

    try {
        const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name : fullName,
            phone,
            email,
            password
        })
      });
      const data = await response.json();

      if (response.ok) {
        console.log("Signup successful:", data);
        navigate("/");  // Redirect to login
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <div className="login-container">
        <h2>Signup</h2>
        <form onSubmit={signup}>
          <input
            type="text"
            value={fullName}
            placeholder="Full Name"
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <input
            type="text"
            value={phone}
            placeholder="Phone (+92 xxx xxxxxxx)"
            onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
            required
          />
          {phoneError && (
            <p style={{ color: "red", fontSize: "0.85rem" }}>{phoneError}</p>
          )}

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

          <input
            type="password"
            value={confirmPassword}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {passwordError && (
            <p style={{ color: "red", fontSize: "0.85rem" }}>{passwordError}</p>
          )}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>

        {/* Login link */}
        <p style={{ marginTop: "15px", textAlign: "center", fontSize: "0.9rem" }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: "var(--primary)", fontWeight: "bold" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default UserSignup;
