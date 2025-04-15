import React, { useEffect } from "react";
import useWorkoutsContext from '../hooks/useWorkoutsContext';
import useAuthContext from '../hooks/useAuthContext';
import WorkoutDetails from '../components/WorkoutDetails';
import WorkoutForm from "../components/WorkoutForm";
import { Workout } from "../types";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

const Home = () => {
    const { workouts, dispatch } = useWorkoutsContext();
    const { user } = useAuthContext();
    
    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/workouts`, {
                    credentials: 'include'
                });

                const data = await response.json();

                if (response.ok) {
                    dispatch({ type: 'SET_WORKOUTS', payload: data });
                }
            } catch (error) {
                console.error("Error fetching workouts:", error);
            }
        };

        if (user) {
            fetchWorkouts();
        }
    }, [dispatch, user]);

    return ( 
        <div className="home">
            <div className="workouts">
                {workouts && workouts.map((workout: Workout) => (
                    <WorkoutDetails key={workout._id} workout={workout} />
                ))}
            </div>
            <WorkoutForm />
        </div>
     );
};
 
export default Home;