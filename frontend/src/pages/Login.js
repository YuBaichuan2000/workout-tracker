import React, { useState } from "react";
import useLogin from "../hooks/useLogin";

// Get the backend URL from your environment variables.
// Make sure you have REACT_APP_BACKEND_URL defined in your .env file.
const backendUrl = process.env.REACT_APP_BACKEND_URL

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading, forgotPassword } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  const handleForgot = async (e) => {
    e.preventDefault();

    await forgotPassword(email);

    if (!error) {
      alert("Password reset email sent. Please check your inbox.");
    }

  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    // Redirect to the Google login endpoint using the environment variable for the URL.
    window.location.href = `${backendUrl}/api/users/google`;
  };

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h3>Log in</h3>

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

      <button disabled={isLoading}>Log in</button>
      <button onClick={handleGoogleLogin} disabled={isLoading}>
        Google
      </button>
      {/* <button onClick={handleForgot}>Forgot Password</button> */}
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default Login;
