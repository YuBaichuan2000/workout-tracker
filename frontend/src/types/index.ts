// User interface
export interface User {
    email: string;
  }
  
  // Workout interface
  export interface Workout {
    _id: string;
    title: string;
    reps: number;
    load: number;
    createdAt: string;
    updatedAt: string;
    user_id: string;
  }
  
  // Auth context state
  export interface AuthState {
    user: User | null;
    dispatch: React.Dispatch<AuthAction>;
  }
  
  // Auth action types
  export type AuthActionType = 'LOGIN' | 'LOGOUT';
  
  // Auth action interface
  export interface AuthAction {
    type: AuthActionType;
    payload?: any;
  }
  
  // Workouts context state
  export interface WorkoutsState {
    workouts: Workout[] | null;
    editWorkout: Workout | null;
    dispatch: React.Dispatch<WorkoutsAction>;
  }
  
  // Workouts action types
  export type WorkoutsActionType = 
    | 'SET_WORKOUTS' 
    | 'CREATE_WORKOUT' 
    | 'DELETE_WORKOUT' 
    | 'EDIT_WORKOUT'
    | 'SET_EDIT_WORKOUT';
  
  // Workouts action interface
  export interface WorkoutsAction {
    type: WorkoutsActionType;
    payload: any;
  }
  
  // Login hook return type
  export interface UseLoginReturn {
    login: (email: string, password: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<any>;
    error: string | null;
    isLoading: boolean;
  }
  
  // Signup hook return type
  export interface UseSignupReturn {
    signup: (email: string, password: string) => Promise<void>;
    error: string | null;
    isLoading: boolean;
  }
  
  // Logout hook return type
  export interface UseLogoutReturn {
    logout: () => Promise<void>;
  }