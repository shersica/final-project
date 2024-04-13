import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UserLibraryState } from './userlibrary.reducer';
import { UserLibrary } from '../models';

// Define a feature selector to select the user library state from the root store state
export const selectUserLibraryState = createFeatureSelector<UserLibraryState>('userLibrary');

// Define a selector to get the user library array from the user library state
export const selectUserLibrary = createSelector(
  selectUserLibraryState,
  (state: UserLibraryState) => state.userLibrary
);

export const isGameInLibrary = (gameId: number) => createSelector(
  selectUserLibrary,
  (userLibrary: UserLibrary[]) => userLibrary.some(game => game.gameId === gameId)
);