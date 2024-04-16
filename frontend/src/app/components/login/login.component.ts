import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../auth.service';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as Actions from '../../store/action'
import { isLoggedIn, loginError } from '../../store/selectors';
import { filter, first } from 'rxjs';
import { UserService } from '../../user.service';
import { UserLibrary } from '../../models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  private userSvc = inject(UserService)
  private store = inject(Store)
  private authSvc = inject(AuthenticationService)
  private router = inject(Router)
  private fb: FormBuilder = inject(FormBuilder)
  loginForm!: FormGroup
  error$ = this.store.pipe(select(loginError)); 
  isLogin! : boolean
  hide = true


  ngOnInit(): void {
    this.loginForm = this.createForm()
  }

  createForm(): FormGroup {
    return this.fb.group({
      username: this.fb.control<string>('', [Validators.required]),
      password: this.fb.control<string>('', [Validators.required])
    })
  }

  login(){
    this.store.dispatch(Actions.login(this.loginForm.value))
    this.store.select(loginError).subscribe(error => {
      if (error) {
        alert('Login Failed');
      }})
    this.store.select(isLoggedIn).pipe(
      filter(isLoggedIn => !!isLoggedIn), // Filter out falsy (false) values
      first() // Take the first true value (indicating successful login)
    ).subscribe(() => {
      this.userSvc.getUserLibrary(this.loginForm.value['username']).subscribe((resp : UserLibrary[]) => this.store.dispatch(Actions.setUserLibrary({userLibrary : resp})))
      this.router.navigate(['/home']);
    });  
    
  } 
}
