import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../user.service';
import { ReviewService } from '../../review.service';
import { Store, select } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GameService } from '../../game.service';
import { GameDetails, Review, User, UserLibrary } from '../../models';
import { updateUserLibrary } from '../../store/action';
import { selectUser } from '../../store/selectors';
import { isGameInLibrary, selectUserLibrary } from '../../store/userlibrary.selectors';
import { Observable } from 'rxjs';
import { CacheService } from '../../cache.service';


@Component({
  selector: 'app-edit-review',
  templateUrl: './edit-review.component.html',
  styleUrl: './edit-review.component.css'
})
export class EditReviewComponent implements OnInit {

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
  username! : string
  ratingTypes = ['Not Yet Rated','Exceptional', 'Recommend', 'Meh', 'Skip']
  userRating!: string 
  gameStatus!: string
  userLibrary!: UserLibrary[]
  gameId!: number
  currentReview! : Review
  backgroundImg!: string
  
  ngOnInit(): void {
    this.username = this.activatedRoute.snapshot.params['username']
    this.gameId = this.activatedRoute.snapshot.params['gameId']
    this.reviewSvc.getUserGameReview(this.gameId, this.username).subscribe(review => {
      console.log('current review', review);
      this.currentReview = review;
  
      this.gameSvc.getGameById(this.gameId).subscribe(resp => {
        this.game = resp
        this.backgroundImg =this.game.backgroundImage
        this.store.select(isGameInLibrary(this.gameId)).subscribe(resp => console.log('is game in library??', resp))
        this.store.select(selectUserLibrary).subscribe(userLibrary => {
          console.log('current user library from edit review', resp)
          const game : UserLibrary | undefined = userLibrary.find(g => g.gameId == this.gameId);
          console.log('Game found:', game);
          this.gameStatus = game?.gameStatus ?? 'Uncategorized'
          this.reviewForm = this.createForm()
        }).unsubscribe();  
      });
    });

  }

  createForm(): FormGroup {
    return this.fb.group({
      rating: this.fb.control<string>(this.currentReview.rating , [Validators.required]),
      comment: this.fb.control<string>(this.currentReview.comment, [Validators.required])
    })
  }

  updateReview(){
    if(this.reviewForm.invalid){
      alert('Please fill in the required fields')
    } else {

      const review : Review  = {
        id: this.currentReview.id,
        gameId: this.currentReview.gameId,
        rating : this.reviewForm.value['rating'],
        reviewer: this.username,
        comment: this.reviewForm.value['comment'],
      }
      console.log('Review to update:',review)
      this.store.dispatch(updateUserLibrary({gameId : review.gameId , gameStatus: this.gameStatus, userRating : review.rating}))
      this.store.select(selectUserLibrary).subscribe(userLibrary => this.userLibrary = userLibrary )
      // this.userSvc.saveUserLibrary(this.userLibrary).subscribe()
      this.reviewSvc.updateReview(review).subscribe(resp => {
        if(resp.success){
          alert('Review Updated')
          this.cache.clear('/api/reviews/game/' + this.game.gameId)
          this.router.navigate(['/game', this.currentReview.gameId])
        } else {
          alert('Failed to update review')
        }
      })
    }

  }

  deleteReview(reviewId: number | undefined){
    console.log(reviewId)
    this.reviewSvc.deleteReview(reviewId).subscribe(resp => {
      console.log(resp.success)      
      if(resp.success){
        alert('Review Deleted')
        this.cache.clear('/api/reviews/game/' + this.currentReview.gameId)
        this.router.navigate(['/game', this.currentReview.gameId])
      } else {
        alert('Failed to deleter review')
      }
    },
    err => console.log(err.error))
  }

}


