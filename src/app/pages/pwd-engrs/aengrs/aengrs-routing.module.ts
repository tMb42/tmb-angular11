import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AeCasteComponent } from './ae-caste/ae-caste.component';
import { AeConfirmationComponent } from './ae-confirmation/ae-confirmation.component';
import { AeGradationComponent } from './ae-gradation/ae-gradation.component';
import { AePromotionComponent } from './ae-promotion/ae-promotion.component';
import { AeRetirementComponent } from './ae-retirement/ae-retirement.component';

const AeRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "gradation",
        component: AeGradationComponent
      },
      {
        path: "confirmation",
        component: AeConfirmationComponent
      },
      {
        path: "Promotion",
        component: AePromotionComponent
      },
      {
        path: "caste",
        component: AeCasteComponent
      },
      {
        path: "retirement",
        component: AeRetirementComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(AeRoutes)],
  exports: [RouterModule]
})
export class AengrsRoutingModule { }
