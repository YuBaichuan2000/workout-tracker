import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Reset = () => {
  const { token } = useParams(); // Assumes your route is defined as '/reset/:token'
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch the email from the backend using the token when the component mounts
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/users/reset-password/${token}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.error || "Failed to fetch email.");
        } else {
          setEmail(data.email); // Assumes the backend responds with { email: "user@example.com" }
        }
      } catch (err) {
        setError("Something went wrong while fetching email.");
      }
    };

    if (token) {
      fetchEmail();
    }
  }, [token]);

  // Handle form submission to reset password
  const handleSubmit = async (e) => {
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
        body: JSON.stringify({ email, password: newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to reset password.");
      } else {
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

  return (
    <div className="reset-container">
      <h3>Reset Password</h3>
      {error && <div className="error">{error}</div>}
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} readOnly />
        </div>
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
