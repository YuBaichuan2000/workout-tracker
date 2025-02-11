import React, {useEffect} from "react";
import useWorkoutsContext from '../hooks/useWorkoutsContext';

import WorkoutDetails from '../components/WorkoutDetails';
import WorkoutForm from "../components/WorkoutForm";

const Home = () => {

    const {workouts, dispatch} = useWorkoutsContext();

    useEffect(() => {
        const fetchWorkouts = async () => {
            // 'https://workout-tracker-f15p.onrender.com';
            const response = await fetch('http://localhost:4000/api/workouts');
            const data = await response.json();

            if (response.ok) {
                dispatch({type: 'SET_WORKOUTS',payload: data});
            }

        }

        fetchWorkouts();

    }, [dispatch]);


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