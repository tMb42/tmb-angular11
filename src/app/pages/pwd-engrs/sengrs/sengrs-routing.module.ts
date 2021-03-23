import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeCasteComponent } from './se-caste/se-caste.component';
import { SeGradationComponent } from './se-gradation/se-gradation.component';
import { SePromotionComponent } from './se-promotion/se-promotion.component';
import { SeRetirementComponent } from './se-retirement/se-retirement.component';

const SeRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "gradation",
        component: SeGradationComponent
      },
      {
        path: "Promotion",
        component: SePromotionComponent
      },
      {
        path: "caste",
        component: SeCasteComponent
      },
      {
        path: "retirement",
        component: SeRetirementComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(SeRoutes)],
  exports: [RouterModule]
})
export class SengrsRoutingModule { }
