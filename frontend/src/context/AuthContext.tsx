import { createContext, useReducer, useEffect } from "react";
import { User, AuthState, AuthAction } from '../types';

// Initialize context with proper typing
export const AuthContext = createContext<AuthState | undefined>(undefined);

export const authReducer = (state: { user: User | null }, action: AuthAction) => {
    switch (action.type){
        case 'LOGIN':
            return {
                user: action.payload
            }
        case 'LOGOUT':
            return {
                user: null
            }
        default:
            return state;
    }
}

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(authReducer, {user: null});

    useEffect(() => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || 'null'); 
            
            if (user) {
                dispatch({type: 'LOGIN', payload: user});
            }
        } catch (error) {
            console.error('Failed to parse user from localStorage', error);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            { children }
        </AuthContext.Provider>
    )
}