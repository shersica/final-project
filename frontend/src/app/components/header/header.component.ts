import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { isLoggedIn, selectUser } from '../../store/selectors';
import { User, UserLibrary } from '../../models';
import { Observable } from 'rxjs';
import * as AuthActions from '../../store/action'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { selectUserLibrary } from '../../store/userlibrary.selectors';
import { UserService } from '../../user.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  logoUrl: string = 'assets/playpal.png'
  private store = inject(Store)
  user$!: Observable<User | null>
  // isLoggedIn$! : Observable<boolean>
  isLoggedIn = false

  private userSvc = inject(UserService)
  private router = inject(Router)
  private fb: FormBuilder = inject(FormBuilder)
  searchForm!: FormGroup
  userLibrary!: UserLibrary[]

  ngOnInit(): void {
    this.store.select(isLoggedIn).subscribe(resp => this.isLoggedIn = resp)
    this.user$ = this.store.select(selectUser);
    this.searchForm = this.createForm()
  }

  createForm(): FormGroup {
    return this.fb.group({
      query: this.fb.control<string>('', [Validators.required]),
    })
  }

  search() {
    const query = this.searchForm.value['query']
    if(query){
      this.router.navigate(['/search'], { queryParams: { query: query } })
      this.searchForm.reset()
    }
  }


  logout(){
    this.store.select(selectUserLibrary).subscribe(userLibrary => this.userLibrary = userLibrary )
    this.userSvc.saveUserLibrary(this.userLibrary).subscribe(resp => console.log(resp))
    this.store.dispatch(AuthActions.logout())
    console.log('logout success')
    this.router.navigate(['/home'])
  }

}
