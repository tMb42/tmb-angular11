import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
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
  deviceInfo = null;

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
    },
    {
      provider: 'facebook',
      icon: 'mdi-facebook',
      iconColor: '#007bff'
    },
  ]

  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute, 
    private router: Router,
    private authService: AuthService,
    private deviceService: DeviceDetectorService 
  ) { 
      this.epicFunction();

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

  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    console.log(this.deviceInfo);
    console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
    console.log(isTablet);  // returns if the device us a tablet (iPad etc)
    console.log(isDesktopDevice); // returns if the app is running on a Desktop browser.
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
      device_name: this.deviceInfo.deviceType + ' - ' + this.deviceInfo.os_version + ' - ' + this.deviceInfo.browser      
    }
        
    this.authService.login(loginData).pipe(first()).subscribe( response => {
      this.isLoading = false;
      // get return url from query parameters or default to home page
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
      this.router.navigateByUrl(returnUrl);
      Swal.fire({ position: 'top-end', icon: 'success', title: 'Thank you for signing in', showConfirmButton: false, timer: 2000 });      
    },
      (err: any) => {
        console.log(err.error.message);
        this.isLoading = false;
      if(err.error.message !=null){
        Swal.fire({ position: 'top-end', icon: 'info', title: err.error.message, showConfirmButton: false, timer: 4000 }); 
      }else{
        
      }
        Swal.fire({position: 'top-end', icon: 'error', title: err.error.errors.message, showConfirmButton: false, timer: 4000 });
      }
    );

  }

  socialiteLogin(data: any) {
    this.isLoading = true;
    this.authService.loginWithSocialite(data).pipe(first()).subscribe((response: any) => {
      this.isLoading = false;
    })

  }


}
