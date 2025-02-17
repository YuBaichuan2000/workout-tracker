import React, {useEffect} from "react";
import useWorkoutsContext from '../hooks/useWorkoutsContext';

import WorkoutDetails from '../components/WorkoutDetails';
import WorkoutForm from "../components/WorkoutForm";
import useAuthContext from '../hooks/useAuthContext';


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL


const Home = () => {

    const {workouts, dispatch} = useWorkoutsContext();
    const { user } = useAuthContext();
    

    useEffect(() => {
        const fetchWorkouts = async () => {

            const response = await fetch(`${BACKEND_URL}/api/workouts`, {
                credentials: 'include'
              });

            const data = await response.json();

            if (response.ok) {
                dispatch({type: 'SET_WORKOUTS',payload: data});
            }

        }

        if (user) {
            fetchWorkouts();
        }
        

    }, [dispatch, user]);


    return ( 
        <div className="home">
            <div className="workouts">
                {workouts && workouts.map((workout) => (
                    <WorkoutDetails key={workout._id} workout={workout}></WorkoutDetails>
                ))}
            </div>
            <WorkoutForm />
        </div>
     );
}
 
export default Home;