import { WorkoutsContext } from "../context/WorkoutContext";
import { useContext } from "react";
import { WorkoutsState } from "../types";

const useWorkoutsContext = () => {
    const context = useContext(WorkoutsContext);

    if (!context) {
        throw Error('useWorkoutsContext must be used inside an WorkoutsContextProvider')
    }

    return context as WorkoutsState;
}
 
export default useWorkoutsContext;