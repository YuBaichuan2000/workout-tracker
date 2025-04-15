import { createContext, useReducer } from 'react';
import { Workout, WorkoutsState, WorkoutsAction } from '../types';

// Initialize context with proper typing
export const WorkoutsContext = createContext<WorkoutsState | undefined>(undefined);

export const workoutsReducer = (
    state: { 
        workouts: Workout[] | null; 
        editWorkout: Workout | null;
    }, 
    action: WorkoutsAction
) => {
    switch (action.type) {
        case 'SET_WORKOUTS':
            return { 
                ...state, workouts: action.payload
            }
        case 'CREATE_WORKOUT':
            return {
                ...state, workouts: [action.payload, ...(state.workouts || [])]
            }
        case 'DELETE_WORKOUT':
            return {
                ...state, workouts: state.workouts ? 
                    state.workouts.filter((workout) => workout._id !== action.payload._id) : 
                    null
            }
        case 'EDIT_WORKOUT':
            return {
                ...state, workouts: state.workouts ? 
                    state.workouts.map((workout) => workout._id === action.payload._id ? action.payload : workout) : 
                    null
            }
        case 'SET_EDIT_WORKOUT':
            return {
                ...state, editWorkout: action.payload
            }
        default: 
            return state
    }
}

export const WorkoutsContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(workoutsReducer, {
        workouts: null,
        editWorkout: null
    });

    return (
        <WorkoutsContext.Provider value={{ ...state, dispatch }}>
            { children }
        </WorkoutsContext.Provider>
    )
}