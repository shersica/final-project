import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-followers',
  templateUrl: './user-followers.component.html',
  styleUrl: './user-followers.component.css'
})
export class UserFollowersComponent implements OnInit {

  private activatedRoute = inject(ActivatedRoute)
  followers = []
  username!: string


  ngOnInit(): void {
    this.username = this.activatedRoute.snapshot.params['username']
  }


}
