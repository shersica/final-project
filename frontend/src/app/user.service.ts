import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, lastValueFrom, timestamp } from "rxjs";
import { UserLibrary } from "./models";
import { deleteFromUserLibrary } from "./store/action";

@Injectable()
export class UserService {

    private http = inject(HttpClient)

    baseUrl = 'http://localhost:8080'

    saveUserLibrary(userLibrary : UserLibrary[]): Observable<any>{
        console.log('saving user libary', userLibrary)
        return this.http.post<any>('/api/saveLibrary', userLibrary)
    }

    getUserLibrary(username : string): Observable<any>{
        return this.http.get<any>(`/api/user/${username}/library`)
    }

    deleteFromUserLibrary(id : string): Observable<any>{
        console.log('deleting from library backend', id)

        return this.http.post<any>('/api/deleteFromLibrary', id)
    }

    //UserSocials

    getUserSocials(username : any) : Observable<any> {
        return this.http.get<any>(`/api/user/${username}/socials`)
    }

    unfollowUser(userToUnfollow : string, currentUser : string) : Promise<any> {
        const options = {
                userToUnfollow: userToUnfollow,
                currentUser: currentUser
              
          };
        return lastValueFrom(this.http.post<any>(`/api/user/unfollow`, options))
    }

    followUser(userToFollow : string, currentUser : string) : Promise<any> {
        const options = {
                userToFollow: userToFollow,
                currentUser: currentUser
              
          };
        return lastValueFrom(this.http.post<any>(`/api/user/follow`, options))
    }

    //User Profile

    saveProfile(formData : any): Promise<any> {
        return lastValueFrom(this.http.post<any>('/api/user/profile/save', formData ))
    }

    getUserProfile(username: any): Observable<any> {

        return this.http.get<any>(`/api/user/profile/${username}`)
    }
    
}