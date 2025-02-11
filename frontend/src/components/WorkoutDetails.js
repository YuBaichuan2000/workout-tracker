import useWorkoutsContext from '../hooks/useWorkoutsContext';

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const WorkoutDetails = ( {workout} ) => {

    const { dispatch } = useWorkoutsContext();

    const handleDelete = async () => {
        const response = await fetch('http://localhost:4000/api/workouts/'+workout._id, {
            method: 'DELETE'});
        const json = await response.json();
        
        if (response.ok) {
            dispatch({type: 'DELETE_WORKOUT', payload: json});
        }
    }

    const handleEdit = () => {
        // const response = await fetch('http://localhost:4000/api/workouts/'+workout._id, {method: 'PATCH'});
        // const json = await response.json();
        
        // if (response.ok) {
        //     dispatch({type: 'EDIT_WORKOUT', payload: json});
        // }
        dispatch({type: 'SET_EDIT_WORKOUT', payload: workout});
    }

    return ( 
        <div className="workout-details">
            <h4>{workout.title}</h4>
            <p><strong>Load (kg): </strong>{workout.load}</p>
            <p><strong>Reps: </strong>{workout.reps}</p>
            <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>
            <button className="material-symbols-outlined" onClick={handleEdit}>edit</button>
            <button className="material-symbols-outlined" onClick={handleDelete}>delete</button>
        </div>
    );
}
 
export default WorkoutDetails;