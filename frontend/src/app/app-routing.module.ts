import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SearchComponent } from './components/search/search.component';
import { GameComponent } from './components/game/game.component';
import { UserComponent } from './components/user/user.component';
import { UserFollowersComponent } from './components/user-followers/user-followers.component';
import { UserFollowingComponent } from './components/user-following/user-following.component';
import { SubmitReviewComponent } from './components/submit-review/submit-review.component';
import { UserReviewsComponent } from './components/user-reviews/user-reviews.component';
import { AboutComponent } from './components/about/about.component';
import { EditReviewComponent } from './components/edit-review/edit-review.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';

const routes: Routes = [
  { path:'', component: HomeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'search', component: SearchComponent},
  { path: 'game/:gameId', component: GameComponent},
  { path: 'user/:username', component: UserComponent},
  { path: 'user/followers/:username', component: UserFollowersComponent},
  { path: 'user/following/:username', component: UserFollowingComponent},
  { path: 'submitreview/:gameId' , component: SubmitReviewComponent},
  { path: 'user/:username/reviews', component: UserReviewsComponent},
  { path: 'about', component: AboutComponent},
  { path: 'editreview/:gameId/:username', component: EditReviewComponent},
  { path: 'settings/:username', component: UserSettingsComponent},
  { path:'**', redirectTo: '/', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
