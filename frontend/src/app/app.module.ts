import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './components/about/about.component';
import { EditReviewComponent } from './components/edit-review/edit-review.component';
import { GameComponent } from './components/game/game.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SearchComponent } from './components/search/search.component';
import { SubmitReviewComponent } from './components/submit-review/submit-review.component';
import { UserComponent } from './components/user/user.component';
import { UserFollowersComponent } from './components/user-followers/user-followers.component';
import { UserFollowingComponent } from './components/user-following/user-following.component';
import { UserReviewsComponent } from './components/user-reviews/user-reviews.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './material/material.module';
import { authReducer } from './store/reducer';
import { userLibraryReducer } from './store/userlibrary.reducer';
import { AuthEffects } from './store/auth.effects';
import { AuthenticationService } from './auth.service';
import { GameService } from './game.service';
import { ReviewService } from './review.service';
import { UserService } from './user.service';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    EditReviewComponent,
    GameComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    SearchComponent,
    SubmitReviewComponent,
    UserComponent,
    UserFollowersComponent,
    UserFollowingComponent,
    UserReviewsComponent,
    UserSettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    StoreModule.forRoot({auth: authReducer , userLibrary : userLibraryReducer}, {}),
    EffectsModule.forRoot([AuthEffects]),
    MaterialModule
  ],
  providers: [
    provideAnimationsAsync(), AuthenticationService, GameService, ReviewService, UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
