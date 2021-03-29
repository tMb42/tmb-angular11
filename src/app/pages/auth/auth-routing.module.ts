import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { PasswordForgotComponent } from './password/password-forgot/password-forgot.component';
import { PasswordResetComponent } from './password/password-reset/password-reset.component';
import { RegisterComponent } from './register/register.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

import { FacebookComponent } from './socialite/facebook/facebook.component';
import { GithubComponent } from './socialite/github/github.component';
import { GoogleComponent } from './socialite/google/google.component';
import { SendMailComponent } from '../send-mail/send-mail.component';

const AuthRoutes: Routes = [
  {
    path: '',
    children: [ 
      {
        path: 'contact',
        component: SendMailComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },  
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'verify-email',
        component: VerifyEmailComponent
      },
      {
        path: 'forgot-password',
        component: PasswordForgotComponent
      },
      {
        path: 'reset-password',
        component: PasswordResetComponent
      },      
      {
        path: 'google/callback',
        component: GoogleComponent
      },
      {
        path: 'facebook/callback',
        component: FacebookComponent
      },
      {
        path: 'github/callback',
        component: GithubComponent
      },
      
    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(AuthRoutes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
