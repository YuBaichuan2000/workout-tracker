import useAuthContext from './useAuthContext';

const useLogout = () => {
    const { dispatch } = useAuthContext();

    const logout = () => {

        // update global state and remove from local storage
        localStorage.removeItem('user');

        dispatch({type: 'LOGOUT'});
    }

    return {logout};
}
 
export default useLogout;