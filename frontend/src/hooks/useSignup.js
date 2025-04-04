import { useState } from "react";
// import useAuthContext from './useAuthContext';

const useSignup = () => {

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    // const { dispatch } = useAuthContext();
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

    const signup = async (email, password) => {
        setIsLoading(true);
        setError(null);

       

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
        }
        if (response.ok) {
            // save user to local storage
            // localStorage.setItem('user', JSON.stringify(json))

            // // update auth context
            // dispatch({type: 'LOGIN', payload: json});

            setIsLoading(false);
        }

    }
    return {signup, isLoading, error};
}
 
export default useSignup;