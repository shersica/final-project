import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthenticationService } from '../../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  private authSvc = inject(AuthenticationService)
  private fb: FormBuilder = inject(FormBuilder)
  registerForm!: FormGroup

  ngOnInit(): void {
    this.registerForm = this.createForm()
  }

  createForm(): FormGroup {
    return this.fb.group({
      username: this.fb.control<string>('', [Validators.required]),
      email: this.fb.control<string>('', [Validators.required, Validators.email]),
      password: this.fb.control<string>('', [Validators.required]),
      password2: this.fb.control<string>('', [Validators.required]),
    }, {validator: this.passwordMatchValidator})
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const password2 = control.get('password2');

    return password && password2 && password.value !== password2.value ? { 'passwordMismatch': true } : null;
  };

  register(){
    const user = {
      username: this.registerForm.value['username'],
      email: this.registerForm.value['email'],
      password: this.registerForm.value['password']
    }
    this.authSvc.register(user).subscribe((resp) => {
      if(resp.id != null){
        this.registerForm = this.createForm()
        alert('success')
        // const alert = document.getElementById('success-alert')
        // alert?.classList.remove('hidden')
      }
    },
    (error) => {
      if (error.status === 400) {
        alert('Username already exists');
      } else {
        alert('An error occurred. Please try again later.');
      }
    })
  }
}
