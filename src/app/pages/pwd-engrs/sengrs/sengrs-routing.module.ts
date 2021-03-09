import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeGradationComponent } from './se-gradation/se-gradation.component';

const SeRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "gradation",
        component: SeGradationComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(SeRoutes)],
  exports: [RouterModule]
})
export class SengrsRoutingModule { }
