import { createContext, useReducer } from 'react';

export const WorkoutsContext = createContext();

export const workoutsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_WORKOUTS':
            return { 
                ...state, workouts: action.payload
            }
        case 'CREATE_WORKOUT':
            return {
                ...state, workouts: [action.payload, ...state.workouts]
            }
        case 'DELETE_WORKOUT':
            return {
                ...state, workouts: state.workouts.filter((workout) => workout._id!==action.payload._id)
            }

        case 'EDIT_WORKOUT':
            return {
                ...state, workouts: state.workouts.map((workout) => workout._id === action.payload._id ? action.payload : workout)
            }
        
        case 'SET_EDIT_WORKOUT':
            return {
                ...state, editWorkout: action.payload
            }


        default: 
            return state
    }
}

export const WorkoutsContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(workoutsReducer, {
        workouts: null,
        editWorkout: null
    });


    return (
        <WorkoutsContext.Provider value={ {...state, dispatch} }>
            { children }
        </WorkoutsContext.Provider>
    )
}
