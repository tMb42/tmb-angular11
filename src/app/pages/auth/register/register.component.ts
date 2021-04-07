import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthService } from 'src/app/services/auth.service';
import { MustMatch } from '../../../validation/must-match.validator';
import Swal from 'sweetalert2';
import { Md5 } from 'ts-md5';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  checked: boolean = false;
  hide = true;
  submitted = false;
  isLoading = false;
  error: {};
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    
    this.registerForm = this.fb.group({
      firstname: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      middlename: new FormControl(null),
      lastname: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      password_confirmation: new FormControl(null, [Validators.required, Validators.minLength(8)]),     
      termsAndCondition: new FormControl(false, [Validators.required])     
    }, 
      { validator: MustMatch('password', 'password_confirmation')}
    );
  }

  aggreTermsAndCondition(){
    return this.checked = true;    
  }
  disAggreTermsAndCondition(){
    return this.checked = false; 
  }

  onSubmit() {
    this.submitted = true;
    this.isLoading = true;
    // reset alerts on submit
    // this.alertService.clear();
    // console.log(this.loginForm.getRawValue());
    const formData = this.registerForm.getRawValue();
    // converting password to MD5
    // const md5 = new Md5();
    // const passwordMd5 = md5.appendStr(formData.password).end();     
    // const ConfirmPasswordMd5 = md5.appendStr(formData.password_confirmation).end();     
    const registerData = {
      firstname: formData.firstname,
      middlename: formData.middlename,
      lastname: formData.lastname,
      name: formData.firstname + ' ' + formData.middlename + ' ' + formData.lastname,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.password_confirmation      
    }

    this.authService.register(registerData).pipe(first()).subscribe(response => {
      console.log(response),
      this.router.navigate(['../login'], { relativeTo: this.route });
      Swal.fire({ position: 'top-end', icon: 'success', showConfirmButton: false, timer: 6000, title: "Welcome, Your Registration is Completed. Please verify your E-mail before login" });       
    },
    (err: any) => {
      this.isLoading = false;
      if(err.error.errors.email !=null){
      Swal.fire({ position: 'top-end', icon: 'info', title: err.error.errors.email, showConfirmButton: false, timer: 4000 }); 
      }else{
        Swal.fire({ position: 'top-end', icon: 'error',  title: err.error.errors.password, showConfirmButton: false, timer: 4000 });
      }
    });

  }


}
