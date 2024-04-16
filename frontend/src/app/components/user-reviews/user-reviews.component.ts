import { Component, OnInit, inject } from '@angular/core';
import { ReviewService } from '../../review.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Review, User } from '../../models';
import { GameService } from '../../game.service';
import { Store } from '@ngrx/store';
import { isLoggedIn, selectUser } from '../../store/selectors';
import { CacheService } from '../../cache.service';

@Component({
  selector: 'app-user-reviews',
  templateUrl: './user-reviews.component.html',
  styleUrl: './user-reviews.component.css'
})
export class UserReviewsComponent implements OnInit {

  private cache = inject(CacheService)
  private store = inject(Store)
  private router = inject(Router)
  private gameSvc = inject(GameService)
  private reviewSvc = inject(ReviewService)
  private activatedRoute = inject(ActivatedRoute)
  username!: string
  reviews!: Review[]
  isLoggedIn? : boolean
  currentUser? : User | null



  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.username = params['username'];
      this.cache.clear('/api/reviews/user/' + this.username)
      this.reviewSvc.getReviewsByUser(this.username).subscribe(resp => {
        this.reviews = resp
        this.fetchGameNamesForReviews()
      })
    })
    this.store.select(isLoggedIn).subscribe(resp => {
      this.isLoggedIn = resp
      console.log('login?:', this.isLoggedIn)
      if(this.isLoggedIn == true){
        this.store.select(selectUser).subscribe(user => {this.currentUser = user, console.log('user:', user)})
      }
    })
  }

  fetchGameNamesForReviews(): void {
    this.reviews.forEach(review => {
      console.log(review.gameId)
      this.gameSvc.getGameById(review.gameId)
        .subscribe(game => {
          review.gameName = game.name;
        });
    });
  }

  editReview(gameId: number, username: string | undefined){
    this.router.navigate(['/editreview', gameId, username])
  }

  deleteReview(reviewId: number | undefined){
    console.log(reviewId)
    this.reviewSvc.deleteReview(reviewId).subscribe(resp => {
      console.log(resp.success)      
      if(resp.success){
        alert('Review Deleted')
        this.reviews = this.reviews.filter(review => review.id !== reviewId);
      } else {
        alert('Failed to delete')
      }
    },
    err => console.log(err.error))
  }
}
