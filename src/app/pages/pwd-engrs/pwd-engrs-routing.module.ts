import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JeGradationComponent } from './jengrs/je-gradation/je-gradation.component';

const PwdEngrsRoutes: Routes = [
  {
    path: '',
    children: [ 
      {
        path: 'engrs',
        component: JeGradationComponent
      },  
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(PwdEngrsRoutes)],
  exports: [RouterModule]
})
export class PwdEngrsRoutingModule { }
