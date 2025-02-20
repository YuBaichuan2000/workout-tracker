import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSignup from "../hooks/useSignup";

// Get the backend URL from your environment variables.
// Ensure that REACT_APP_BACKEND_URL is defined in your .env file.
const backendUrl = process.env.REACT_APP_BACKEND_URL

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, error, isLoading } = useSignup();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(email, password);

    if (!error) {
      navigate("/verify-email");
    }


  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    window.location.href = `${backendUrl}/api/users/google`;
  };

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Sign up</h3>

      <label>Email:</label>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />

      <label>Password:</label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />

      <button disabled={isLoading}>Sign up</button>
      <button disabled={isLoading} onClick={handleGoogleLogin}>
        Google
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default Signup;
