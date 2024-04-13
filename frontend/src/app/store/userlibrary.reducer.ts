import { createReducer, on } from "@ngrx/store";
import { UserLibrary } from "../models";
import * as UserLibraryActions from './action'


export interface UserLibraryState {
    userLibrary: UserLibrary[];
}
  
const userLibraryInitialState: UserLibraryState = {
    userLibrary: []
};

export const userLibraryReducer = createReducer(
    userLibraryInitialState,
    on(UserLibraryActions.addToUserLibrary, (state, { game }) => {
        // Check if the game with the same gameId already exists
        const existingGame = state.userLibrary.find(userGame => userGame.gameId === game.gameId);
      
        // If the game with the same gameId already exists, return the current state
        if (existingGame) {
          return state;
        }
      
        // If the game with the same gameId doesn't exist, add the new game to the array
        return {
          ...state,
          userLibrary: [...state.userLibrary, game]
        };
    }),
    on(UserLibraryActions.updateUserLibrary, (state, { gameId, gameStatus, userRating }) => ({
        ...state,
        userLibrary: state.userLibrary.map(userGame =>
            userGame.gameId === gameId ? { ...userGame, gameStatus, userRating } : userGame
        )
    })),
    on(UserLibraryActions.deleteFromUserLibrary,(state, {gameId}) => ({
        ...state,
        userLibrary: state.userLibrary.filter(game => game.gameId !== gameId)
    })),
    on(UserLibraryActions.setUserLibrary, (state, { userLibrary }) => ({
        ...state,
        userLibrary: userLibrary
      })),
    on(UserLibraryActions.updateUserRating, (state, { gameId, userRating }) => ({
        ...state,
        userLibrary: state.userLibrary.map(userGame =>
            userGame.gameId === gameId ? { ...userGame, userRating ,gameStatus: userGame.gameStatus } : userGame
        )
    })),
);
