import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../game.service';
import { GameDetails, Review, User, UserLibrary } from '../../models';
import { Store, select } from '@ngrx/store';
import { selectUser } from '../../store/selectors';
import { selectUserLibrary } from '../../store/userlibrary.selectors';
import { ReviewService } from '../../review.service';
import { updateUserLibrary, updateUserRating } from '../../store/action';
import { UserService } from '../../user.service';
import { CacheService } from '../../cache.service';

@Component({
  selector: 'app-submit-review',
  templateUrl: './submit-review.component.html',
  styleUrl: './submit-review.component.css'
})
export class SubmitReviewComponent implements OnInit {

  private cache = inject(CacheService)
  private router = inject(Router)
  private userSvc = inject(UserService)
  private reviewSvc = inject(ReviewService)
  private store = inject(Store)
  private activatedRoute = inject(ActivatedRoute)
  reviewForm! : FormGroup
  private fb = inject(FormBuilder)
  private gameSvc = inject(GameService)
  game!: GameDetails
  currentUser!: User | null
  ratingTypes = ['Not Yet Rated','Exceptional', 'Recommend', 'Meh', 'Skip']
  userRating!: string 
  gameStatus!: string
  userLibrary!: UserLibrary[]
  backgroundImg!: string


  
  ngOnInit(): void {
    this.gameSvc.getGameById(this.activatedRoute.snapshot.params['gameId'])
    .subscribe(resp => {
      this.game = resp 
      this.backgroundImg = this.game.backgroundImage
      this.store.select(selectUserLibrary).subscribe(userLibrary => {
        const game : UserLibrary | undefined = userLibrary.find(g => g.gameId === this.game.gameId);
        console.log('Game found:', game);
        this.userRating = game?.userRating ?? 'Rate the game'
        this.gameStatus = game?.gameStatus ?? ''
        this.reviewForm = this.createForm()
      }).unsubscribe();  
    })
    this.store.pipe(select(selectUser)).subscribe(user => this.currentUser = user)

  }

  createForm(): FormGroup {
    return this.fb.group({
      rating: this.fb.control<string>(this.userRating , [Validators.required]),
      comment: this.fb.control<string>('', [Validators.required])
    })
  }

  submitReview(){
    if(this.reviewForm.invalid){
      alert('Please fill in the required fields')
    } else {

      const review : Review  = {
        gameId: this.game.gameId,
        rating : this.reviewForm.value['rating'],
        reviewer: this.currentUser?.username ?? '',
        comment: this.reviewForm.value['comment'],
      }
      console.log('Review to submit:',review)
      this.store.dispatch(updateUserLibrary({gameId : review.gameId , gameStatus: this.gameStatus, userRating : review.rating}))
      this.store.select(selectUserLibrary).subscribe(userLibrary => this.userLibrary = userLibrary )
      // this.userSvc.saveUserLibrary(this.userLibrary).subscribe()
      this.reviewSvc.submitReview(review).subscribe(resp => {
        console.log(resp.success)
        this.cache.clear('/api/reviews/game/' + this.game.gameId)
        this.cache.clear('api/reviews/user/' + this.currentUser?.username)
        this.router.navigate(['/game', this.game.gameId])
      })
    }

  }

}
