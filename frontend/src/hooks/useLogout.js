import useAuthContext from './useAuthContext';
import useWorkoutsContext from './useWorkoutsContext';

const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: workoutsDispatch } = useWorkoutsContext();

  const logout = async () => {
    try {
      // Call the logout endpoint to clear the HTTP-only cookie on the server
      await fetch('http://localhost:4000/api/users/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Failed to logout on server:', error);
    }

    // Remove any client-stored user data (if any)
    localStorage.removeItem('user');

    // Update global state
    dispatch({ type: 'LOGOUT' });
    workoutsDispatch({ type: 'SET_WORKOUTS', payload: null });
  };

  return { logout };
};

export default useLogout;
