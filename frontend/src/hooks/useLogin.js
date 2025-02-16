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

        // const response = await fetch('https://workout-tracker-f15p.onrender.com/api/users/login', {
        //     method: 'POST',
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify({email, password})
        // });

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

    


    return {login, isLoading, error};
}
 
export default useLogin;