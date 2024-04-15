import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfile } from '../../models';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.css'
})
export class UserSettingsComponent implements OnInit {

  @ViewChild('photo')
  photo!: ElementRef;

  private router = inject(Router)
  private activatedRoute = inject(ActivatedRoute)
  private userSvc = inject(UserService)
  private fb = inject(FormBuilder)
  form!: FormGroup
  username!: string
  currentUserProfile!: UserProfile
  isFileSelected: boolean = false
  fileName: string = ''
  profilePic!: string

  ngOnInit(): void {
    this.username = this.activatedRoute.snapshot.params['username']
    this.userSvc.getUserProfile(this.username).subscribe(resp =>{
      this.currentUserProfile = resp
      this.profilePic = this.currentUserProfile.profilePic
    })
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
      formData.set('id', this.currentUserProfile.id)
      console.log('saving form data: ', formData)
      this.userSvc.saveProfile(formData)
        .then((response: any) => {
          console.log(response.success)
          this.router.navigate(['/user', this.username])
        })
        .catch((err) => {
          console.log(err)
        })
  }


  onFileSelected(event: any): void {
    // Check if a file is selected
    this.isFileSelected = event.target.files && event.target.files.length > 0;
    
    // If file is selected, get the file name
    if (this.isFileSelected) {
      this.fileName = event.target.files[0].name;
    } else {
      this.fileName = '';
    }
  }
}
