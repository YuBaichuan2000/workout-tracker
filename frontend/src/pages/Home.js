import React, {useEffect} from "react";
import useWorkoutsContext from '../hooks/useWorkoutsContext';

import WorkoutDetails from '../components/WorkoutDetails';
import WorkoutForm from "../components/WorkoutForm";
import useAuthContext from '../hooks/useAuthContext';

const Home = () => {

    const {workouts, dispatch} = useWorkoutsContext();
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchWorkouts = async () => {

            // const response = await fetch('http://localhost:4000/api/workouts', {
            //     headers: {
            //         'Authorization': `Bearer ${user.token}`
            //     }
            // });

            const response = await fetch('https://workout-tracker-f15p.onrender.com/api/workouts', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
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