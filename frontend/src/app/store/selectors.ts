import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(
  selectAuthState,
  state => state.user
);

export const isLoggedIn = createSelector(
  selectAuthState,
  state => state.isLoggedIn
);

export const loginError = createSelector(
    selectAuthState,
    (state: AuthState) => state.error
  );