import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Game, User, UserLibrary, UserProfile, UserSocials } from '../../models';
import { Store, select } from '@ngrx/store';
import { selectUserLibrary } from '../../store/userlibrary.selectors';
import { GameService } from '../../game.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addToFollowing, deleteFromUserLibrary, updateUserLibrary } from '../../store/action';
import { selectUser } from '../../store/selectors';
import { UserService } from '../../user.service';
import * as Actions from '../../store/action'


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {

  private userSvc = inject(UserService)
  private fb: FormBuilder = inject(FormBuilder)
  private gameSvc = inject(GameService)
  private store = inject(Store)
  private activatedRoute = inject(ActivatedRoute)
  username!: string
  favGames!: Game[]
  userLibrary!: UserLibrary[]
  gameStatusTypes = ['Uncategorized', 'Currently Playing', 'Completed', 'Played', 'Not Played']
  currentUser! : User | null
  gameForms: FormGroup[] = [];
  ratingTypes = ['Not Yet Rated','Exceptional', 'Recommend', 'Meh', 'Skip']
  following : string[] = []
  profile!: UserProfile
  isFollowing!: boolean
  panelOpenState = false


  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.username = params['username'];
      this.store.pipe(select(selectUser)).subscribe(user => {
        this.currentUser = user;
      });

      //if is current user's library -> selectUserLibrary -> push to form
      if(this.currentUser?.username === this.username){
        this.store.pipe(select(selectUserLibrary)).subscribe(userLibrary => {
          this.userLibrary = userLibrary;
          console.log('current user userlibrary:',userLibrary);
          this.userLibrary.forEach(game => {
            const form = this.createForm(game.gameStatus, game.userRating);
            this.gameForms.push(form);
          })
        });
      } else {
        //Get UL -> DIsplay 
        this.userSvc.getUserLibrary(this.username).subscribe((resp: UserLibrary[]) => {
          // this.store.dispatch(Actions.setUserLibrary({ userLibrary: resp }));
          resp.forEach(game => {
            const form = this.createForm(game.gameStatus, game.userRating);
            this.gameForms.push(form);
          });
 
          this.userLibrary = resp;
        });
      }

      // this.userSvc.getUserLibrary(this.username).subscribe((resp: UserLibrary[]) => {
      //   this.store.dispatch(Actions.setUserLibrary({ userLibrary: resp }));
      //   resp.forEach(game => {
      //     const form = this.createForm(game.gameStatus, game.userRating);
      //     this.gameForms.push(form);
      //   });
      //      // Subscribe to the userLibrary store state to get userLibrary data
      //   this.store.pipe(select(selectUserLibrary)).subscribe(userLibrary => {
      //     this.userLibrary = userLibrary;
      //     console.log(userLibrary);
      //   });
      // });
      //Get User Profile
      this.userSvc.getUserProfile(this.username).subscribe(resp => this.profile = resp )
    });
  
    // Subscribe to the currentUser store state to get currentUser data
    // this.store.pipe(select(selectUser)).subscribe(user => {
    //   this.currentUser = user;
    // });

    //Check if currentuser is following user
    this.userSvc.getUserSocials(this.currentUser?.username).subscribe((resp: UserSocials) => {
      const followingList: string[] = resp.following;
      this.isFollowing = followingList.includes(this.username);
    })
  }
  

  createForm(initialStatus: string, initialRating: string): FormGroup {
    return this.fb.group({
      gameStatus: this.fb.control<string>(initialStatus),
      userRating: this.fb.control<string>(initialRating)
    })
  }

  updateUserLibrary(gameId : number, index : number){
    const status = this.gameForms[index].value['gameStatus'];
    const rating = this.gameForms[index].value['userRating'];
    this.store.dispatch(updateUserLibrary({gameId : gameId , gameStatus : status, userRating : rating}))
    console.log('updating user library:', this.userLibrary)
  }

  deleteFromUserLibrary(id: string, gameId : number){
    if(id === ''){
      this.store.dispatch(deleteFromUserLibrary({gameId : gameId}))
    } else {
      this.store.dispatch(deleteFromUserLibrary({gameId : gameId}))
      this.userSvc.deleteFromUserLibrary(id).subscribe(resp => console.log(resp))
    }
  }

  followUser(usernameToFollow : string, currentUser : any){
    this.userSvc.followUser(usernameToFollow, currentUser).then(resp => { 
      console.log(resp.success)
      this.isFollowing = true
    });
    
  }

  unfollowUser(usernameToUnfollow : string, currentUser : any){
    this.userSvc.unfollowUser(usernameToUnfollow, currentUser).then(resp => {
      console.log(resp.success)
      this.isFollowing = false
    });
  }


}
