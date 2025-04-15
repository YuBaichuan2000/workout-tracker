import React, { useState, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";

const backendUrl = process.env.REACT_APP_BACKEND_URL || '';

type ResetParams = {
  token?: string;
};

const Reset = () => {
  const params = useParams<ResetParams>();
  const token = params.token || '';
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();
  const [newPassword, setNewPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // Handle form submission to reset password
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }
    setError("");
    try {
      const response = await fetch(`${backendUrl}/api/users/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password: newPassword }), // Only sending new password
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to reset password.");
      } else {
        // Automatically log the user in using the returned data
        localStorage.setItem("user", JSON.stringify(data));
        dispatch({ type: "LOGIN", payload: data });
        setMessage("Password reset successfully. Logging you in...");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  // Rest of the component remains the same
  return (
    <div className="reset-container">
      <h3>Reset Password</h3>
      {error && <div className="error">{error}</div>}
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default Reset;