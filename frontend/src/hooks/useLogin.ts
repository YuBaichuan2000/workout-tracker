import { useState } from "react";
import useAuthContext from './useAuthContext';
import { UseLoginReturn } from "../types";

const useLogin = (): UseLoginReturn => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { dispatch } = useAuthContext();
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

    const login = async (email: string, password: string): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
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
                return;
            }
            
            // save user to local storage, but just email
            localStorage.setItem('user', JSON.stringify(json))

            // update auth context
            dispatch({type: 'LOGIN', payload: json});
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setError('Network error occurred');
        }
    }

    const forgotPassword = async (email: string): Promise<any> => {
        setIsLoading(true);
        setError(null);
    
        try {
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
        } catch (error) {
            setIsLoading(false);
            setError('Network error occurred');
            return { error: 'Network error occurred' };
        }
    };
    
    return { login, forgotPassword, isLoading, error };
}
 
export default useLogin;