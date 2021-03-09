import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first, finalize } from 'rxjs/operators';
import { AuthService } from '../../../../services/auth.service';
import { MustMatch } from '../../../../validation/must-match.validator';
import { AlertService } from '../../../../services/alert.service';
import Swal from 'sweetalert2';

enum TokenStatus {
  Validating,
  Valid,
  Invalid
}

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  TokenStatus = TokenStatus;
  tokenStatus = TokenStatus.Validating;
  token:  any = null;
  resetPasswordForm: FormGroup;
  isLoading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute,  
    private authService: AuthService, 
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    
    this.resetPasswordForm = this.fb.group({  
      email: new FormControl('', [Validators.required, Validators.email]),    
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      password_confirmation: new FormControl(null, [Validators.required, Validators.minLength(8)]) 
    }, {
      validator: MustMatch('password', 'password_confirmation')
    });
    
    
    // const token = this.route.snapshot.queryParams['token'];
    
    // remove token from url to prevent http referer leakage
    // this.router.navigate([], { relativeTo: this.route, replaceUrl: true });

    // this.authService.validateResetToken(token)
    //   .pipe(first())
    //   .subscribe({
    //     next: () => {
    //       this.token = token;
    //       this.tokenStatus = TokenStatus.Valid;
    //     },
    //     error: () => {
    //       this.tokenStatus = TokenStatus.Invalid;
    //     }
    //   });


  }

  // convenience getter for easy access to form fields
  // get f() { return this.resetPasswordForm.controls; }

  resetLoginPassword() {
    this.submitted = true; 

    // reset alerts on submit
    this.alertService.clear(); 

    this.isLoading = true;

    const formData = this.resetPasswordForm.getRawValue();
    const resetPassworData = {
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
      token: this.route.snapshot.queryParams['token']       
    }
    console.log(resetPassworData);
    this.authService.resetPassword(resetPassworData)
      .pipe(first())
      .subscribe( (res: any) => {
          Swal.fire({ position: 'top-end', icon: 'success', title: res.message, showConfirmButton: false, timer: 4000});
          // this.alertService.success('Password reset successful, you can now login', { keepAfterRouteChange: true });
          this.router.navigate(['../login'], { relativeTo: this.route });
        },
        (err) => {
          this.isLoading = false;
          Swal.fire({ position: 'top-end', icon: 'error', title: err.error.error, showConfirmButton: false, timer: 4000});
        }
      );
    
    // this.authService.sendPasswordResetLinkToEmail(data)
    // .pipe(first())
    // .pipe(finalize(() => this.isLoading = false))
    // .subscribe({ 
    //   next: () => {
    //     Swal.fire({
    //       position: 'top-end',
    //       icon: 'success',
    //       title: 'Please check your email for password reset instructions',
    //       showConfirmButton: false,
    //       timer: 4000
    //     });  

    //   },
    //   error: (err) => {
    //     console.log(err);
    //     this.isLoading = false;
    //     Swal.fire({
    //       position: 'top-end',
    //       icon: 'error',
    //       title: err,
    //       showConfirmButton: false,
    //       timer: 4000
    //     });
    //   }

    // });
  }

}