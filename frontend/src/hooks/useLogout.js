import useAuthContext from './useAuthContext';
import useWorkoutsContext from './useWorkoutsContext';

const useLogout = () => {
    const { dispatch } = useAuthContext();
    const { dispatch: workoutsDispatch } = useWorkoutsContext();

    const logout = () => {

        // update global state and remove from local storage
        localStorage.removeItem('user');

        dispatch({type: 'LOGOUT'});

        workoutsDispatch({type: 'SET_WORKOUTS', payload: null});
    }

    return {logout};
}
 
export default useLogout;