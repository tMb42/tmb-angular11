import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../services/auth.guard';
import { TenderComponent } from './cpanel/tender/tender.component';
import { PwdWorkingProfileComponent } from './pwd-working-profile/pwd-working-profile.component';

import { TenderDetailsComponent } from './tender-details/tender-details.component';

const PwdWorksRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'pwd-working-profile',
        component: PwdWorkingProfileComponent,
        canActivate: [AuthGuard]
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
        path: 'cpanel-tender',
        canActivate: [AuthGuard],
        data: {
          roles: ["super_admin", "junior_engineer","assistant_engineer", "executive_engineer"]
        },
        component: TenderComponent
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(PwdWorksRoutes)],
  exports: [RouterModule]
})
export class PwdWorksRoutingModule { }
