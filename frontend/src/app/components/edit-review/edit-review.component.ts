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
import { selectUserLibrary } from '../../store/userlibrary.selectors';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-edit-review',
  templateUrl: './edit-review.component.html',
  styleUrl: './edit-review.component.css'
})
export class EditReviewComponent implements OnInit {

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

  
  ngOnInit(): void {
    this.username = this.activatedRoute.snapshot.params['username']
    this.gameId = this.activatedRoute.snapshot.params['gameId']
    this.reviewSvc.getUserGameReview(this.gameId, this.username).subscribe(review => {
      console.log('current review', review);
      this.currentReview = review;
  
      this.gameSvc.getGameById(this.gameId).subscribe(resp => {
        this.game = resp
        this.store.select(selectUserLibrary).subscribe(userLibrary => {
          const game : UserLibrary | undefined = userLibrary.find(g => g.gameId === this.gameId);
          console.log('Game found:', game);
          this.gameStatus = game?.gameStatus ?? ''
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
    this.userSvc.saveUserLibrary(this.userLibrary).subscribe()
    this.reviewSvc.updateReview(review).subscribe(resp => {
      if(resp.success){
        alert('Review Updated')
        this.router.navigate(['/game', this.currentReview.gameId])
      } else {
        alert('Failed to update')
      }
    })
  }

  deleteReview(reviewId: number | undefined){
    console.log(reviewId)
    this.reviewSvc.deleteReview(reviewId).subscribe(resp => {
      console.log(resp.success)      
      if(resp.success){
        alert('Review Deleted')
        this.router.navigate(['/game', this.currentReview.gameId])
      } else {
        alert('Failed to delete')
      }
    },
    err => console.log(err.error))
  }

}


