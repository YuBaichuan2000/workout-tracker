import { useEffect, useState, FormEvent } from "react";
import useWorkoutsContext from "../hooks/useWorkoutsContext";
import useAuthContext from '../hooks/useAuthContext';

const WorkoutForm = () => {
    const { dispatch, editWorkout } = useWorkoutsContext();

    const [title, setTitle] = useState<string>('');
    const [load, setLoad] = useState<string>('');
    const [reps, setReps] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [emptyFields, setEmptyFields] = useState<string[]>([]);
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

    const { user } = useAuthContext();

    useEffect(() => {
        if (editWorkout) {
            setTitle(editWorkout.title);
            setLoad(editWorkout.load.toString());
            setReps(editWorkout.reps.toString());
        }
    }, [editWorkout]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user) {
            setError('You must be logged in');
            return;
        }

        const workout = { title, load, reps };
        let response, json;
        
        try {
            if (editWorkout) {
                response = await fetch(`${BACKEND_URL}/api/workouts/${editWorkout._id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(workout),
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });

                json = await response.json();

                if (response.ok) {
                    // Dispatch EDIT_WORKOUT action to update the workout in the list
                    dispatch({ type: 'EDIT_WORKOUT', payload: json });
                    // Clear edit state
                    dispatch({ type: 'SET_EDIT_WORKOUT', payload: null });
                }
            } else {
                response = await fetch(`${BACKEND_URL}/api/workouts`, {
                    method: 'POST', 
                    body: JSON.stringify(workout), 
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });

                json = await response.json();

                if (response.ok) {
                    dispatch({ type: 'CREATE_WORKOUT', payload: json });
                }
            }
            
            if (!response.ok) {
                setError(json.error);
                setEmptyFields(json.empty || []);
            } else {
                setTitle('');
                setLoad('');
                setReps('');
                setError(null);
                setEmptyFields([]);
            }
        } catch (error) {
            console.error("Error submitting workout:", error);
            setError('Failed to submit workout');
        }
    }

    const handleAISuggest = async () => {
        if (!user) {
            setError('You must be logged in');
            return;
        }
        
        try {
            const response = await fetch(`${BACKEND_URL}/api/workouts/suggest`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
        
            const suggestion = await response.json();
        
            if (response.ok) {
                // Fill the form fields with the AI suggestion
                setTitle(suggestion.title);
                setLoad(suggestion.load.toString());
                setReps(suggestion.reps.toString());
                setError(null);
                setEmptyFields([]);
            } else {
                setError(suggestion.error || 'Failed to get AI suggestion');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while fetching AI suggestion');
        }
    };

    return ( 
        <form className="create" onSubmit={handleSubmit}>
            <h3>{editWorkout ? "Edit Workout" : "Add a new workout"}</h3>
            <label>Exercise:</label>
            <input 
                type="text" 
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                className={emptyFields.includes('title') ? 'error' : ''}
            />
            <label>Load (in kg):</label>
            <input 
                type="number" 
                min="1"
                onChange={(e) => setLoad(e.target.value)}
                value={load}
                className={emptyFields.includes('load') ? 'error' : ''}   
            />
            <label>Reps:</label>
            <input 
                type="number" 
                min="1"
                onChange={(e) => setReps(e.target.value)}
                value={reps}
                className={emptyFields.includes('reps') ? 'error' : ''}
            />
            <button>{editWorkout ? "Update Workout" : "Add Workout"}</button>
            <button type="button" onClick={handleAISuggest}>AI Suggest</button>
            {error && <div className="error">{error}</div>}
        </form>
    );
}
 
export default WorkoutForm;