import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from '../../../../services/auth.service';
import { PasswordValidation } from '../../../../validation/password-validator';
import Swal from 'sweetalert2';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent implements OnInit {
  changePasswordForm : FormGroup;
  hide = true;
  submitted = false;
  isLoading = false;
  
  validPassword: boolean = false;
  validConfirmPassword: boolean = false;
  matcher = new MyErrorStateMatcher();

  constructor(private formBuilder: FormBuilder, private authService: AuthService) { }

  isFieldValid(form: FormGroup, field: string) {
    return !form.get(field).valid && form.get(field).touched;
  }

  displayFieldCss(form: FormGroup, field: string) {
    return {
    'has-error': this.isFieldValid(form, field),
    'has-feedback': this.isFieldValid(form, field)
    };
  }

  onPasswordChange() {
    if (this.changePasswordForm.valid) {
      this.submitted = true;
      this.isLoading = true;

      const formData = this.changePasswordForm.getRawValue();
      const changePasswordData = {
        currentPassword: formData.currentPassword,
        password: formData.password,
        newPassword: formData.confirmPassword,
      }
      console.log(changePasswordData);
      this.authService.changeLoginPassword(changePasswordData)
        .pipe(first())
        .subscribe( (res: any) => {
        if(res.success == 1){
          this.isLoading = false;
          Swal.fire({ position: 'top-end', icon: 'success', title: res.message, showConfirmButton: false, timer: 4000});
        }else{
          this.isLoading = false;
          Swal.fire({ position: 'top-end', icon: 'error', title: res.message, showConfirmButton: false, timer: 6000});
        }
      });
     
    } else {
      this.validateAllFormFields(this.changePasswordForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      password: ['',  Validators.compose([Validators.required, Validators.minLength(8)])],
      confirmPassword: ['', Validators.required],
    }, 
    {
      validator: PasswordValidation.MatchPassword // your validation method
    });

  }

  passwordValidation(e){
    if (e.length > 7) {
      this.validPassword = true;
    }else{
      this.validPassword = false;
    }
  }

  confirmPasswordValidation(e){
    if (this.changePasswordForm.controls['password'].value === e) {
      this.validConfirmPassword = true;
    }else{
      this.validConfirmPassword = false;
    }
  }


}
