import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/services/auth.guard';
import { AssistantEngrsComponent } from './assistant-engrs/assistant-engrs.component';
import { JuniorEngrsComponent } from './junior-engrs/junior-engrs.component';
import { SeniorEngrsComponent } from './senior-engrs/senior-engrs.component';

const pwdEngrsControlRoute: Routes = [
  { path: '', redirectTo: '/engrsCpanel', pathMatch: 'full' },
  {
    path: '',
    children: [ 
      {
        path: 'update-je',
        component: JuniorEngrsComponent,
        canActivate: [AuthGuard],
        data: {
          roles: ["super_admin", "admin"]
        },
      },
      {
        path: 'update-ae',
        component: AssistantEngrsComponent,
        canActivate: [AuthGuard],
        data: {
          roles: ["super_admin", "admin"]
        },
      },
      {
        path: 'update-se',
        component: SeniorEngrsComponent,
        canActivate: [AuthGuard],
        data: {
          roles: ["super_admin", "admin"]
        },
      },
    ]
  }
      

];

@NgModule({
  imports: [RouterModule.forChild(pwdEngrsControlRoute)],
  exports: [RouterModule]
})
export class ControlPanelRoutingModule { }
