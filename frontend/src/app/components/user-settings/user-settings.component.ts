import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.css'
})
export class UserSettingsComponent implements OnInit {

  @ViewChild('photo')
  photo!: ElementRef;

  private activatedRoute = inject(ActivatedRoute)
  private userSvc = inject(UserService)
  private fb = inject(FormBuilder)
  form!: FormGroup
  username!: string

  ngOnInit(): void {
    this.username = this.activatedRoute.snapshot.params['username']
    this.userSvc.getUserProfile(this.username).subscribe(resp => console.log(resp))
    this.form = this.createForm()
  }

  createForm(): FormGroup {
    return this.fb.group({
      photo: this.fb.control<string>('', [Validators.required]),
      name: this.fb.control<string>('', [Validators.required]),
      bio: this.fb.control<string>('', [Validators.required])
    })
  }

  processForm(){
      const formData = new FormData()
      formData.set('picture', this.photo.nativeElement.files[0])
      formData.set('name', this.form.value.name)
      formData.set('bio', this.form.value.bio)
      formData.set('username', this.username )
      console.log('saving form data: ', formData)
      this.userSvc.saveProfile(formData)
        .then((response: any) => {
          console.log(response.success)
        })
        .catch((err) => {
          console.log(err)
        })
  }
}
