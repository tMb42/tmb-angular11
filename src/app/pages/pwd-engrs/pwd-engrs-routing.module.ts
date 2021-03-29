import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../services/auth.guard';

import { JeGradationComponent } from './jengrs/je-gradation/je-gradation.component';

const PwdEngrsRoutes: Routes = [
  {
    path: '',
    children: [ 
      {
        path: 'engrs',
        component: JeGradationComponent,
        canActivate: [AuthGuard],
        data: {
          roles: ["super_admin"]
        }
      },  
    ]    
  }
];

@NgModule({
  imports: [RouterModule.forChild(PwdEngrsRoutes)],
  exports: [RouterModule]
})
export class PwdEngrsRoutingModule { }
