import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../services/auth.guard';
import { PwdWorkingProfileComponent } from './pwd-working-profile/pwd-working-profile.component';

import { TenderDetailsComponent } from './tender-details/tender-details.component';

const PwdWorksRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'pwd-working-update-profile',
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

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(PwdWorksRoutes)],
  exports: [RouterModule]
})
export class PwdWorksRoutingModule { }
