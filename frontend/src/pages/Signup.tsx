import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import useSignup from "../hooks/useSignup";

// Get the backend URL from your environment variables.
const backendUrl = process.env.REACT_APP_BACKEND_URL || '';

const Signup = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { signup, error, isLoading } = useSignup();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signup(email, password);

    if (!error) {
      navigate("/verify-email");
    }
  };

  const handleGoogleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
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

      <button disabled={!!isLoading}>Sign up</button>
      <button disabled={!!isLoading} onClick={handleGoogleLogin}>
        Google
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default Signup;