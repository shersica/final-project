import { Injectable, inject } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { AuthenticationService } from '../auth.service';
import * as AuthActions from './action'
import { tap, map, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AuthEffects {

  login$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.login),
    switchMap(({ username, password }) =>
      this.authService.login({username, password}).pipe(
        map(user => AuthActions.loginSuccess({ user })),
        catchError((error) => of(AuthActions.loginFailure({ error})))
      )
    )
  ));

  displayErrorAlert = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginFailure),
      tap(({ error }) => {
        console.log('Error:', error);
      })
    );
  }, { dispatch: false });


  constructor(
    private actions$: Actions,
    private authService: AuthenticationService
  ) {}
}