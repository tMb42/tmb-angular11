import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../services/auth.guard';

import { JeCasteComponent } from './je-caste/je-caste.component';
import { JeGradationComponent } from './je-gradation/je-gradation.component';
import { JePassedComponent } from './je-passed/je-passed.component';
import { JePromotionComponent } from './je-promotion/je-promotion.component';
import { JeRetirementComponent } from './je-retirement/je-retirement.component';

const JeRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "gradation",
        canActivate: [AuthGuard],
        component: JeGradationComponent,
        data: {
          roles: ["junior_engineer", "chief_engineer"]
        }
      },
      {
        path: "passed",
        component: JePassedComponent
      },
      {
        path: "Promotion",
        component: JePromotionComponent
      },
      {
        path: "caste",
        component: JeCasteComponent
      },
      {
        path: "retirement",
        component: JeRetirementComponent
      },
    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(JeRoutes)],
  exports: [RouterModule]
})
export class JengrsRoutingModule { }
