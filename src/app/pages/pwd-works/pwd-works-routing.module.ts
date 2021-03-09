import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TenderDetailsComponent } from './tender-details/tender-details.component';

const PwdWorksRoutes: Routes = [
  {
    path: '',
    children: [ 
      {
        path: 'tender-details',
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
