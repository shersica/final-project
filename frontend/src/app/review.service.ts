import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, timestamp } from "rxjs";
import { LikeStats, Review, ReviewInteractions } from "./models";

@Injectable()
export class ReviewService {
    private http = inject(HttpClient)

    baseUrl = 'http://localhost:8080'

    //Reviews
    submitReview(review : Review): Observable<any>{
        return this.http.post<any>('/api/postreview', review)
    }

    updateReview(review : Review): Observable<any>{
        return this.http.put<any>('/api/updatereview', review)
    }

    deleteReview(reviewId: number | undefined): Observable<any> {
        const options = {
          body: { id: reviewId } 
        };
        return this.http.delete<any>('/api/deletereview', options);
    }

    getReviewsByGameId(gameId : number): Observable<any> {

        return this.http.get<any>(`/api/reviews/game/${gameId}`)
    }

    getReviewsByUser(username : string): Observable<any> {
        return this.http.get<any>(`/api/reviews/user/${username}`)
    }

    getUserGameReview(gameId: number, username: string | undefined): Observable<any> {
        return this.http.get<any>(`/api/reviews/game/${gameId}/user/${username}`)
    }

    //Review Interactions
    getReviewInteractionsByReviewId(reviewId: any): Observable<any> {
        return this.http.get<any>(`/api/reviews/${reviewId}/interactions`)
    }

    updateReviewInteractions(interactions : ReviewInteractions): Observable<any> {
        return this.http.put<any>(`/api/reviewinteractions/update`, interactions)
    }

    //Like Stats
    getLikeStatsByUser(username: any): Observable<any> {
        return this.http.get<any>(`/api/stats/${username}`)
    }

    saveLikeStats(likeStats : LikeStats): Observable<any>{
        console.log('saving stats...', likeStats)
        return this.http.post<any>('/api/stats/save', likeStats)
    }


}