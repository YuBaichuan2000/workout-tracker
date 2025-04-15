// GoogleAuth.tsx
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";
import { User } from "../types";

const GoogleAuth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  useEffect(() => {
    // Retrieve email from query params
    const email = searchParams.get("email");

    if (email) {
      const user: User = { email };
      // Save user to localStorage 
      localStorage.setItem("user", JSON.stringify(user));
      
      dispatch({ type: "LOGIN", payload: user });
      
      navigate("/");
    } else {
      // Handle missing email
      navigate("/login");
    }
  }, [searchParams, dispatch, navigate]);

  return <div>Loading...</div>;
};

export default GoogleAuth;