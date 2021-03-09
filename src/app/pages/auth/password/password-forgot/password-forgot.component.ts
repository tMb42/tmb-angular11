import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-password-forgot',
  templateUrl: './password-forgot.component.html',
  styleUrls: ['./password-forgot.component.scss']
})
export class PasswordForgotComponent implements OnInit {
  forgotPasswordForm: FormGroup; 
  data: FormGroup; 
  isLoading = false;
  submitted = false;
  
  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({      
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  forgotPasswordLink() {
    this.submitted = true; 

    // // stop here if form is invalid
    // if (this.resetPasswordForm.invalid) {
    //   return;
    // } 

    const data = {
      email: this.forgotPasswordForm.value.email      
    }

    this.isLoading = true;

    this.authService.sendPasswordResetLinkToEmail(data)
    .pipe(first())
    .pipe(finalize(() => this.isLoading = false))
    .subscribe({ 
      next: () => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Please check your email for password reset instructions',
          showConfirmButton: false,
          timer: 4000
        });  

      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire({ position: 'top-end', icon: 'error', title: "We can't find a user with that email address", showConfirmButton: false, timer: 4000 });
      }

    });
  }

}
