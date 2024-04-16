import { Injectable, inject } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, withLatestFrom } from 'rxjs/operators';
import * as AuthActions from './action';
import * as UserLibraryActions from './action'
import { UserService } from '../user.service';
import { Store } from '@ngrx/store';
import { selectUserLibrary } from './userlibrary.selectors';

@Injectable()
export class UserLibraryEffects {

    private store = inject(Store)

    constructor(
        private actions$: Actions,
        private userSvc : UserService
    ) {}

}