import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { AuthState } from "../types";

const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw Error('useAuthContext must be used inside an AuthContextProvider')
    }

    return context as AuthState;
}
 
export default useAuthContext;