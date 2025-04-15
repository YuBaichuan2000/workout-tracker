import { useState } from "react";
import { UseSignupReturn } from "../types";

const useSignup = (): UseSignupReturn => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

    const signup = async (email: string, password: string): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${BACKEND_URL}/api/users/signup`, {
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

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setError('Network error occurred');
        }
    }
    
    return {signup, isLoading, error};
}
 
export default useSignup;