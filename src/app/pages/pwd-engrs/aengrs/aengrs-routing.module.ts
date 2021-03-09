import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AeGradationComponent } from './ae-gradation/ae-gradation.component';

const AeRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "gradation",
        component: AeGradationComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(AeRoutes)],
  exports: [RouterModule]
})
export class AengrsRoutingModule { }
