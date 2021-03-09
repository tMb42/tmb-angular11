import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../services/auth.guard';

import { ProfileComponent } from './profile/profile.component';
import { RolesComponent } from './roles/roles.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { UserLayoutComponent } from './users/user-layout.component';
import { PasswordChangeComponent } from '../auth/password/password-change/password-change.component';
import { UserManageComponent } from './users/user-manage.component';
import { UsersComponent } from './users/users.component';
import { UserActiveComponent } from './user-active/user-active.component';
import { UserBlackListComponent } from './user-black-list/user-black-list.component';

const DashboardRoutes: Routes = [
  {
    path: '',
    children: [ 
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'update-profile',
        component: UpdateProfileComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'change-password',
        component: PasswordChangeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'users',
        component: UserLayoutComponent,
        canActivate: [AuthGuard],
        children: [
          { path: '', component: UsersComponent },
          { path: 'add/:id', component: UserManageComponent },
          { path: 'edit/:id', component: UserManageComponent }
        ]
      },
      {
        path: 'active-users',
        component: UserActiveComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'block-users',
        component: UserBlackListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'roles',
        component: RolesComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(DashboardRoutes)],
  exports: [RouterModule]
})

export class DashboardRoutingModule { }
