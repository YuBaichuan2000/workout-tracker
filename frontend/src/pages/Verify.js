import { useState } from "react";
import { useNavigate } from "react-router-dom";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Verify = () => {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const input = e.target.value;

        // Allow only numeric input and limit to 6 digits
        if (/^\d*$/.test(input) && input.length <= 6) {
            setCode(input);
            setError("");
        } else {
            setError("Please enter a valid 6-digit code.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (code.length !== 6) {
            setError("Verification code must be 6 digits.");
            return;
        }

        setError("");
        setMessage("");

        try {
            const response = await fetch(`${backendUrl}/api/users/verify-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ verificationToken: code }) // Ensure naming matches your backend!
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Email verified successfully!");
                // Redirect to login page after a short delay
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                setError(data.error || "Verification failed.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="verify-container">
            <h2>Enter Verification Code</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="6-digit code"
                    value={code}
                    onChange={handleChange}
                    maxLength="6"
                    className="verify-input"
                />
                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}
                <button type="submit" className="verify-button">Verify</button>
            </form>
        </div>
    );
};

export default Verify;
