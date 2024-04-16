import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Game, User, UserLibrary, UserProfile, UserSocials } from '../../models';
import { Store, select } from '@ngrx/store';
import { selectUserLibrary } from '../../store/userlibrary.selectors';
import { GameService } from '../../game.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addToFollowing, deleteFromUserLibrary, updateUserLibrary } from '../../store/action';
import { isLoggedIn, selectUser } from '../../store/selectors';
import { UserService } from '../../user.service';
import { CacheService } from '../../cache.service';
import { UserFollowingComponent } from '../user-following/user-following.component';
import { UserFollowersComponent } from '../user-followers/user-followers.component';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {

  @ViewChild(UserFollowingComponent) followingComponent!: UserFollowingComponent;
  @ViewChild(UserFollowersComponent) followersComponent!: UserFollowersComponent

  private cache = inject(CacheService)
  private router =inject(Router)
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
  ratingTypes = ['Not Yet Rated','Exceptional', 'Recommend', 'Meh', 'Skip']
  following : string[] = []
  profile!: UserProfile
  isFollowing!: boolean
  panelOpenState = false
  uncategorized!: UserLibrary[]
  currentlyPlaying!: UserLibrary[]
  completed!: UserLibrary[]
  notPlayed!: UserLibrary[]
  played!: UserLibrary[]
  isLoggedIn = false
  gameForms: Map<number, FormGroup> = new Map();


  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.username = params['username'];
      this.store.pipe(select(selectUser)).subscribe(user => {
        this.currentUser = user;
        if(this.currentUser !== null){
          this.isLoggedIn = true
        }
      });

      //if is current user's library -> selectUserLibrary -> push to form
      if(this.currentUser?.username === this.username){
        this.store.pipe(select(selectUserLibrary)).subscribe(userLibrary => {
          this.userLibrary = userLibrary;
          console.log('current user userlibrary:',userLibrary);
          this.userLibrary.forEach(game => {
            const form = this.createForm(game.gameStatus, game.userRating);
            this.gameForms.set(game.gameId, form);
          })
          this.sortLibrary(this.userLibrary)
        });
      } else {
        //Get UL -> DIsplay 
        this.userSvc.getUserLibrary(this.username).subscribe((resp: UserLibrary[]) => {
          resp.forEach(game => {
            const form = this.createForm(game.gameStatus, game.userRating);
            this.gameForms.set(game.gameId, form);
          });
 
          this.userLibrary = resp;
          this.sortLibrary(this.userLibrary)
        });
      }

      //Get User Profile
      this.userSvc.getUserProfile(this.username).subscribe((resp:UserProfile) => {
        this.profile = resp 
        if(this.profile.profilePic !== 'https://pbs.twimg.com/media/FzEjZL4aYAU4Vzj.jpg'){
          this.profile.profilePic = this.updatedPic(this.profile.profilePic)
        }
      })

      //Check if currentuser is following user
      this.userSvc.getUserSocials(this.currentUser?.username).subscribe((resp: UserSocials) => {
        const followingList: string[] = resp.following;
        this.isFollowing = followingList.includes(this.username);
      })
    });


  }
  
  updatedPic(url: string): string {
    const timestamp = new Date().getTime();
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}timestamp=${timestamp}`;
  }

  createForm(initialStatus: string, initialRating: string): FormGroup {
    return this.fb.group({
      gameStatus: this.fb.control<string>(initialStatus),
      userRating: this.fb.control<string>(initialRating)
    })
  }

  updateUserLibrary(gameId : number, index : number){
    const status = this.gameForms.get(gameId)?.value['gameStatus']
    const rating = this.gameForms.get(gameId)?.value['userRating'];
    console.log('updating:', status, rating)
    this.store.dispatch(updateUserLibrary({gameId : gameId , gameStatus : status, userRating : rating}))
    console.log('updating user library:', this.userLibrary)
    this.store.pipe(select(selectUserLibrary)).subscribe(userLibrary => {
      this.userLibrary = userLibrary;
      this.sortLibrary(this.userLibrary)
    });
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
    if(this.isLoggedIn){
      this.userSvc.followUser(usernameToFollow, currentUser).then(resp => { 
        console.log(resp.success)
        this.isFollowing = true
        const username = this.currentUser?.username
        const username2 = usernameToFollow
        this.cache.clear(`/api/user/${username}/socials`)
        this.cache.clear(`/api/user/${usernameToFollow}/socials`)
        this.followingComponent.updateFollowing()
        this.followersComponent.updateFollowers()
      });
    } else {
      this.router.navigate(['/login'])
    }

    
  }


  unfollowUser(usernameToUnfollow : string, currentUser : any){
    if(this.isLoggedIn){
      this.userSvc.unfollowUser(usernameToUnfollow, currentUser).then(resp => {
        console.log(resp.success)
        this.isFollowing = false
        const username = this.currentUser?.username
        const username2 = usernameToUnfollow
        this.cache.clear(`/api/user/${username}/socials`)
        this.cache.clear(`/api/user/${usernameToUnfollow}/socials`)
        this.followingComponent.updateFollowing()
        this.followersComponent.updateFollowers()
      });
    } else {
      this.router.navigate(['/login'])
    }

  }

  sortLibrary(userLibrary: UserLibrary[]){
    const uncategorized: UserLibrary[] = [];
    const currentlyPlaying: UserLibrary[] = [];
    const completed: UserLibrary[] = [];
    const played: UserLibrary[] = [];
    const notPlayed: UserLibrary[] = [];
    this.uncategorized = []
    this.currentlyPlaying = []
    this.completed = []
    this.played = []
    this.notPlayed = []


    userLibrary.forEach(game => {
        switch (game.gameStatus) {
            case 'Uncategorized':
                  uncategorized.push(game);
                  this.uncategorized = uncategorized
                  break;
            case 'Currently Playing':
                currentlyPlaying.push(game);
                this.currentlyPlaying = currentlyPlaying
                break;
            case 'Completed':
                completed.push(game);
                this.completed = completed
                break;
            case 'Played':
                played.push(game);
                this.played = played
                break;
            case 'Not Played':
                notPlayed.push(game);
                this.notPlayed = notPlayed
                break;
            default:
                break;
        }
    });

  }



}
