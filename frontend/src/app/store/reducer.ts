import { createReducer, on } from '@ngrx/store';
import { User, UserLibrary } from '../models';
import * as AuthActions from '../store/action'

export interface AuthState {
    user: User | null;
    isLoggedIn: boolean;
    error: any | null; 
  }
  
  const initialState: AuthState = {
    user: null,
    isLoggedIn: false,
    error: null
  };
  
  export const authReducer = createReducer(
    initialState,
    on(AuthActions.loginSuccess, (state, { user }) => ({
      ...state,
      user,
      isLoggedIn: true,
      error: null 
    })),
    on(AuthActions.loginFailure, (state, { error }) => ({
      ...state,
      user: null,
      isLoggedIn: false,
      error 
    })),
    on(AuthActions.logout, state => ({
      ...state,
      user: null,
      isLoggedIn: false,
      error: null 
    }))
  );

