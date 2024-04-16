import { Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { UserService } from '../../user.service';
import { UserProfile, UserSocials } from '../../models';
import { Observable, combineLatest, switchMap } from 'rxjs';

@Component({
  selector: 'app-user-following',
  templateUrl: './user-following.component.html',
  styleUrl: './user-following.component.css'
})
export class UserFollowingComponent implements OnInit{

  private userSvc = inject(UserService)
  private store =inject(Store)
  private activatedRoute = inject(ActivatedRoute)
  following! : string[]
  username!: string
  userProfiles: UserProfile[] = []

  @Input() updatedData: any


  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.username = params['username'];
      console.log(this.username)
      this.userSvc.getUserSocials(this.username).subscribe((resp: UserSocials) => {
        console.log('getting user socials from component')
        this.following = resp.following
        console.log('folllowing', this.following)
        this.userProfiles = []
        if(this.following.length > 0){
          this.following.forEach(username => {
            this.userSvc.getUserProfile(username).subscribe((resp: UserProfile) => {
              console.log('profile', resp)
              this.userProfiles.push(resp)
            })
           })
        }
     })
  })
  }

  updateFollowing(){

    this.username = this.activatedRoute.snapshot.params['username'];
    this.userSvc.getUserSocials(this.username).subscribe((resp: UserSocials) => {
      console.log('getting user socials from component')
      this.following = resp.following
      console.log('folllowing', this.following)
      this.userProfiles = []
      if(this.following.length > 0){
        this.following.forEach(username => {
          this.userSvc.getUserProfile(username).subscribe((resp: UserProfile) => {
            console.log('profile', resp)
            this.userProfiles.push(resp)
          })
         })
      }
   })
  }
}
