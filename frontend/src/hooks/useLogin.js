import { useState } from "react";
import useAuthContext from './useAuthContext';

const useLogin = () => {

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${BACKEND_URL}/api/users/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({email, password})
        });

        const json = await response.json();

        if (!response.ok) {
            setIsLoading(false);
            setError(json.error);
        }
        if (response.ok) {
            // // save user to local storage, but just email
            localStorage.setItem('user', JSON.stringify(json))

            // update auth context
            dispatch({type: 'LOGIN', payload: json});
            setIsLoading(false);
        }
    }

    const forgotPassword = async (email) => {
        setIsLoading(true);
        setError(null);
    
        const response = await fetch(`${BACKEND_URL}/api/users/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email }),
        });
    
        const json = await response.json();
    
        if (!response.ok) {
          setIsLoading(false);
          setError(json.error);
          return json; // Return error response
        }
    
        setIsLoading(false);
        return json; // Return success response (e.g., message)
      };
    
      return { login, forgotPassword, isLoading, error };
}
 
export default useLogin;