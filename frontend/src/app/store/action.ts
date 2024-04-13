import { createAction, props } from '@ngrx/store';
import { GameDetails, User, UserLibrary } from '../models';

//User
export const login = createAction('[Auth] Login', props<{ username: string, password: string }>());
export const logout = createAction('[Auth] Logout');
export const loginSuccess = createAction('[Auth] Login Success', props<{ user: User }>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: any }>());


//User Library
export const addToUserLibrary = createAction('[UserLibrary] Add Game to User Library', props<{ game: UserLibrary }>());
export const updateUserLibrary = createAction('[UserLibrary] Update UserGame Interaction', props<{ gameId: number, gameStatus: string, userRating : string }>());
export const deleteFromUserLibrary = createAction('[UserLibrary] Delete Game from Library', props<{ gameId: number}>());
export const saveUserLibraryFailure = createAction('[UserLibrary] Fail to save Library', props<{ error: any}>());
export const setUserLibrary = createAction('[User Library] Set User Library',props<{ userLibrary: UserLibrary[] }>());
export const updateUserRating = createAction('[UserLibrary] Update UserGame Interaction', props<{ gameId: number, userRating : string }>());


//User Following/Followers
export const addToFollowing = createAction('', props<{user: string}>())