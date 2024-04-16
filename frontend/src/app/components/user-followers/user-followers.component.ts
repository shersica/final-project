import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../user.service';
import { Store } from '@ngrx/store';
import { UserProfile, UserSocials } from '../../models';

@Component({
  selector: 'app-user-followers',
  templateUrl: './user-followers.component.html',
  styleUrl: './user-followers.component.css'
})
export class UserFollowersComponent implements OnInit {

  private userSvc = inject(UserService)
  private store =inject(Store)
  private activatedRoute = inject(ActivatedRoute)
  followers! : string[]
  username!: string
  userProfiles: UserProfile[] = []


  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.username = params['username'];
      console.log(this.username)
      this.userSvc.getUserSocials(this.username).subscribe((resp: UserSocials) => {
        this.followers = resp.followers
        console.log('folllowing', this.followers)
        this.userProfiles = []
        if(this.followers.length > 0){
          this.followers.forEach(username => {
            this.userSvc.getUserProfile(username).subscribe((resp: UserProfile) => {
              console.log('profile', resp)
              this.userProfiles.push(resp)
            })
           })
        }
     })
  })
  }

  updateFollowers(){
    console.log('updating followers')
    this.username = this.activatedRoute.snapshot.params['username'];
      console.log('from update suername',this.username)
      this.userSvc.getUserSocials(this.username).subscribe((resp: UserSocials) => {
        this.followers = resp.followers
        console.log('folllowing', this.followers)
        this.userProfiles =[]
        if(this.followers.length > 0){
          this.followers.forEach(username => {
            this.userSvc.getUserProfile(username).subscribe((resp: UserProfile) => {
              console.log('profile', resp)
              this.userProfiles.push(resp)
            })
           })
        }
     })
  }


}
