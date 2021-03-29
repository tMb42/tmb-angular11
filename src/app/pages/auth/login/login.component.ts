import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import {Md5} from 'ts-md5/dist/md5';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hide = true;
  rememberMe = false;
  isLoading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  loginError: string;
  
  isLoginMode = true;
  
  socials = [
    {
      provider: 'google',
      icon: 'mdi-google',
      iconColor: '#e91e63'
    },    
    {
      provider: 'github',
      icon: 'mdi-github',
      iconColor: 'black'
    }
    // {
    //   provider: 'facebook',
    //   icon: 'mdi-facebook',
    //   iconColor: '#007bff'
    // },
  ]

  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute, 
    private router: Router,
    private authService: AuthService, 
  ) { 
      // redirect to home if already logged in
      if (this.authService.userValue) {
        this.router.navigate(['/dashboard']);
      }
    }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      rememberMe: new FormControl(false)
    });
  }

  onSubmit() { 
    const formData = this.loginForm.getRawValue(); 
    
    // converting password to MD5
    // const md5 = new Md5();
    // const passwordMd5 = md5.appendStr(formData.password).end();     
    const loginData = {
      email: formData.email,
      password: formData.password,
      remember: formData.rememberMe,
      device_name: 'mobile'      
    }
        
    this.authService.login(loginData).pipe(first()).subscribe({ next: () => {
      // get return url from query parameters or default to home page
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      this.router.navigateByUrl(returnUrl);

      Swal.fire({ position: 'top-end', icon: 'success', title: 'Thank you for signing in', showConfirmButton: false, timer: 2000 });
    },
      error: err => {
        this.error = err;
        this.isLoading = false;
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'The provided credentials are incorrect OR E-mail Verification Not Completed',
          showConfirmButton: false,
          timer: 4000
        });
      }

    });
  }

  socialiteLogin(data: any) {
    this.isLoading = true;
    this.authService.loginWithSocialite(data).pipe(first()).subscribe((response: any) => {
      this.isLoading = false;
    })

  }


}
