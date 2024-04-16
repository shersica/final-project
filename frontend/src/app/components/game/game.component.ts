import { Component, OnInit, inject } from '@angular/core';
import { GameService } from '../../game.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GameDetails, LikeStats, Rating, Review, ReviewInteractions, User, UserLibrary } from '../../models';
import { Store } from '@ngrx/store';
import { isLoggedIn, selectUser } from '../../store/selectors';
import { addToUserLibrary, deleteFromUserLibrary } from '../../store/action';
import { UserService } from '../../user.service';
import { isGameInLibrary, selectUserLibrary } from '../../store/userlibrary.selectors';
import { Observable, map } from 'rxjs';
import { ReviewService } from '../../review.service';
import { MatDialog } from '@angular/material/dialog';
import { ImageComponent } from '../image/image.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {
  private dialog = inject(MatDialog)
  private reviewSvc = inject(ReviewService)
  private userSvc = inject(UserService)
  private store = inject(Store)
  private gameSvc = inject(GameService)
  private activatedRoute = inject(ActivatedRoute)
  private router = inject(Router)
  game! : GameDetails
  isLoggedIn? : boolean
  user? : User | null
  userLibrary: UserLibrary[] = []
  gameInLibrary = false
  gameSub$!: Observable<GameDetails>
  gameId!: number
  reviews!: Review[]
  hasReviewed = false
  reviewInteraction!: ReviewInteractions
  likeStats!: LikeStats[]
  backgroundImg! : string
  highestRating: Rating = {
    title: '',
    count: 0,
    percent: 0
  }
  
  

  ngOnInit(): void {
    this.gameId = parseInt(this.activatedRoute.snapshot.params['gameId'], 10);
    this.gameSub$ = this.gameSvc.getGameById(this.activatedRoute.snapshot.params['gameId'])
    this.gameSvc.getGameById(this.activatedRoute.snapshot.params['gameId']).subscribe((resp: GameDetails) => {
      this.backgroundImg = resp.backgroundImage
      this.game = resp
      this.game.ratings.forEach((rating: Rating)=> {
        if(rating.count > this.highestRating.count){
          console.log('rating count', rating.count)
          this.highestRating = rating
        }
      })
    })
    this.store.select(isLoggedIn).subscribe(resp => {
      this.isLoggedIn = resp
      console.log('login?:', this.isLoggedIn)
      if(this.isLoggedIn == true){
        this.store.select(selectUser).subscribe(user => {this.user = user, console.log('user:', user)})
        this.reviewSvc.getUserGameReview(this.gameId,this.user?.username ).subscribe(resp => {
          this.hasReviewed = true
        },
        (err) => console.log(err.error)
        )
      }
    })
    this.store.select(isGameInLibrary(this.gameId)).subscribe(resp => this.gameInLibrary = resp)
    //Get review interactions 
    this.reviewSvc.getReviewsByGameId(this.gameId).subscribe(resp => { 
      this.reviews = resp
      console.log('reviews', this.reviews)
      this.reviews.forEach(review => {
        this.reviewSvc.getReviewInteractionsByReviewId(review.id).subscribe(interactions => {
          review.interactions = interactions
        });
        //Check if user has liked/disliked review, link to the review by reviewId
        this.reviewSvc.getLikeStatsByUser(this.user?.username).subscribe(resp => {
          this.likeStats = resp;
          console.log('likestats:', resp);
          // Iterate over the fetched like stats and assign them to corresponding reviews
          this.likeStats.forEach(stats => {
            const review = this.reviews.find(r => r.id === stats.reviewId);
            if (review) {
              // Assign like/dislike status to the review
              review.likeStats = stats;
              console.log('assigning stats to review');
            }
          });
          // Iterate over reviews and assign default like stats to those without stats
          this.reviews.forEach(review => {
            if (!review.likeStats) {
              const likeStat: LikeStats = {
                _id: '',
                reviewId: review.id,
                username: this.user?.username,
                liked: false,
                disliked: false
              };
              console.log('default likestat: ', likeStat);
              review.likeStats = likeStat;
            }
          });
        });
      })
    })   

  }

  addToWishlist(gameId : number){
    if(this.isLoggedIn == true){

    } else {
      this.router.navigate(['/login'])
    }
  }

  addToLibrary(game: GameDetails){
    if(this.isLoggedIn == true){
      this.store.select(selectUser).subscribe(user => {this.user = user, console.log('user:', user)})
      const gameToAdd : UserLibrary = {
        _id : '',
        gameId: game.gameId,
        name: game.name,
        platforms: game.platforms,
        backgroundImage: game.backgroundImage,
        images: game.images,
        genres: game.genres,
        releaseDate: game.releaseDate,
        ratings: game.ratings,
        username: this.user?.username || '' ,
        gameStatus: 'Uncategorized',
        rating: game.rating,
        userRating: 'Not Yet Rated'
      }
      this.store.dispatch(addToUserLibrary({game : gameToAdd}))
      
      console.log('added game')
    } else {
      this.router.navigate(['/login'])
    }
  }

  reviewGame(gameId : number){
    if(this.isLoggedIn == true){
      this.router.navigate(['/submitreview', gameId])

    } else {
      this.router.navigate(['/login'])
    }
  }

  editReview(gameId: number, username: string | undefined){
    this.router.navigate(['/editreview', gameId, username])
  }

  removeFromLibrary(gid: number){
    this.store.dispatch(deleteFromUserLibrary({gameId : gid}))
  }

  like(reviewId: any, likeStats : LikeStats | undefined){
    console.log('Checking:', reviewId, likeStats)
    //get reviewId -> get initial reviewInteractions -> get the current like => +1
    if(this.isLoggedIn == true){
      if(likeStats?.liked == false && likeStats?.disliked == false){
        //user havent like, so like
        this.reviewSvc.getReviewInteractionsByReviewId(reviewId).subscribe(resp => {
          console.log('Interactions: ',resp)
          const review = this.reviews.find(r => r.id === reviewId);
          if (review && review.interactions && review.likeStats) {
            review.interactions.likes++;
            review.likeStats.liked = true
            //save to backend the interactions and stats
            this.reviewSvc.updateReviewInteractions(review.interactions).subscribe(resp => console.log(resp.success))
            this.reviewSvc.saveLikeStats(review.likeStats).subscribe(resp => console.log(resp.success))
          } else{
            console.log('error from trying to like')
          }
        })
      } else if(likeStats?.liked == false && likeStats?.disliked == true) {
        //switch from disliked to like
        this.reviewSvc.getReviewInteractionsByReviewId(reviewId).subscribe(resp => {
          console.log('Interactions: ',resp)
          const review = this.reviews.find(r => r.id === reviewId);
          if (review && review.interactions && review.likeStats) {
            review.interactions.likes++;
            review.interactions.dislikes--;
            review.likeStats.liked = true
            review.likeStats.disliked = false
            //save to backend the interactions and stats
            this.reviewSvc.updateReviewInteractions(review.interactions).subscribe(resp => console.log(resp.success))
            this.reviewSvc.saveLikeStats(review.likeStats).subscribe(resp => console.log(resp.success))
          } else{
            console.log('error from trying to like and remove dislike')
          }
        })
      }
      else {
        //user liked, so unlike
        this.reviewSvc.getReviewInteractionsByReviewId(reviewId).subscribe(resp => {
          const review = this.reviews.find(r => r.id === reviewId);
          if (review && review.interactions && review.likeStats) {
            console.log('unliking')
            review.interactions.likes--;
            review.likeStats.liked = false
            this.reviewSvc.updateReviewInteractions(review.interactions).subscribe(resp => console.log(resp.success))
            this.reviewSvc.saveLikeStats(review.likeStats).subscribe(resp => console.log(resp.success))
          } else {
            console.log('error from trying to unlike')
          }
        })
      }
    } 
    else {
      this.router.navigate(['/login'])
    }
  }

  dislike(reviewId: any, likeStats: LikeStats | undefined){
    if(this.isLoggedIn == true){
      if(likeStats?.disliked == false && likeStats?.liked == false){
        //user havent dislike, so dislike
        this.reviewSvc.getReviewInteractionsByReviewId(reviewId).subscribe(resp => {
          console.log('Interactions: ',resp)
          const review = this.reviews.find(r => r.id === reviewId);
          if (review && review.interactions && review.likeStats) {
            review.interactions.dislikes++;
            review.likeStats.disliked = true
            //save to backend the interactions and stats
            this.reviewSvc.updateReviewInteractions(review.interactions).subscribe(resp => console.log(resp.success))
            this.reviewSvc.saveLikeStats(review.likeStats).subscribe(resp => console.log(resp.success))
          } else{
            console.log('error from trying to dislike')
          }
        })
      } else if(likeStats?.disliked == false && likeStats?.liked == true) {
        //switch from liked to dislike
        this.reviewSvc.getReviewInteractionsByReviewId(reviewId).subscribe(resp => {
          console.log('Interactions: ',resp)
          const review = this.reviews.find(r => r.id === reviewId);
          if (review && review.interactions && review.likeStats) {
            review.interactions.dislikes++;
            review.interactions.likes--;
            review.likeStats.liked = false
            review.likeStats.disliked = true
            //save to backend the interactions and stats
            this.reviewSvc.updateReviewInteractions(review.interactions).subscribe(resp => console.log(resp.success))
            this.reviewSvc.saveLikeStats(review.likeStats).subscribe(resp => console.log(resp.success))
          } else{
            console.log('error from trying to dislike and remove like')
          }
        })
      } 
      else {
        //user disliked, so undislike
        this.reviewSvc.getReviewInteractionsByReviewId(reviewId).subscribe(resp => {
          const review = this.reviews.find(r => r.id === reviewId);
          if (review && review.interactions && review.likeStats) {
            console.log('undisliking')
            review.interactions.dislikes--;
            review.likeStats.disliked = false
            this.reviewSvc.updateReviewInteractions(review.interactions).subscribe(resp => console.log(resp.success))
            this.reviewSvc.saveLikeStats(review.likeStats).subscribe(resp => console.log(resp.success))
          } else {
            console.log('error from trying to undislike')
          }
        })
      }
    } else {
      this.router.navigate(['/login'])
    }
  }

  expandedImage: string | null = null;

  toggleImageSize(image: string) {
      this.expandedImage = this.expandedImage === image ? null : image;
  }

  openImageDialog(image: string): void {
    this.dialog.open(ImageComponent, {
      data: { image: image }
    });
  }


}
