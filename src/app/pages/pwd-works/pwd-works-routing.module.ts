import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../services/auth.guard';
import { TenderEditComponent } from './cpanel/tender-edit/tender-edit.component';
import { TenderComponent } from './cpanel/tender/tender.component';
import { PwdWorkingProfileComponent } from './pwd-working-profile/pwd-working-profile.component';
import { SecurityComponent } from './security/security.component';
import { TenderDetailsComponent } from './tender-details/tender-details.component';

const PwdWorksRoutes: Routes = [
  { path: '', redirectTo: '/pwd-works', pathMatch: 'full' },
  {
    path: '',
    children: [
      {
        path: 'pwd-working-profile',
        canActivate: [AuthGuard],
        data: {
          roles: ["super_admin", "junior_engineer","assistant_engineer", "executive_engineer", "superindending_engineer", "chief_engineer"]
        },
        component: PwdWorkingProfileComponent,
      },
      {
        path: 'tender-details',
        canActivate: [AuthGuard],
        data: {
          roles: ["super_admin", "junior_engineer","assistant_engineer", "executive_engineer", "superindending_engineer", "chief_engineer"]
        },
        component: TenderDetailsComponent
      },
      {
        path: 'security',
        canActivate: [AuthGuard],
        data: {
          roles: ["super_admin", "junior_engineer","assistant_engineer", "executive_engineer"]
        },
        component: SecurityComponent
      },
      {
        path: 'cpanel/add-tender',
        canActivate: [AuthGuard],
        data: {
          roles: ["super_admin", "junior_engineer","assistant_engineer", "executive_engineer"]
        },
        component: TenderComponent
      },
      {
        path: 'cpanel/edit-tender',
        canActivate: [AuthGuard],
        data: {
          roles: ["super_admin", "junior_engineer","assistant_engineer", "executive_engineer"]
        },
        component: TenderEditComponent
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(PwdWorksRoutes)],
  exports: [RouterModule]
})
export class PwdWorksRoutingModule { }
