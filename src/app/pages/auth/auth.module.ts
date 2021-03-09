import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { PasswordForgotComponent } from './password/password-forgot/password-forgot.component';
import { PasswordChangeComponent } from './password/password-change/password-change.component';
import { PasswordResetComponent } from './password/password-reset/password-reset.component';
import { FieldErrorDisplayComponent } from 'src/app/validation/field-error-display/field-error-display.component';

import { GoogleComponent } from './socialite/google/google.component';
import { FacebookComponent } from './socialite/facebook/facebook.component';
import { GithubComponent } from './socialite/github/github.component';

console.log('Test for Auth Module. Loaded Ok')

@NgModule({
  declarations: [LoginComponent, RegisterComponent, VerifyEmailComponent, PasswordForgotComponent, PasswordChangeComponent, PasswordResetComponent, FieldErrorDisplayComponent, GoogleComponent, FacebookComponent, GithubComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FontAwesomeModule,
       
  ]

})

export class AuthModule { }
