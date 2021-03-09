import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { PwdEngrsLayoutComponent } from './layouts/pwd-engrs-layout/pwd-engrs-layout.component';
import { PwdWorksLayoutComponent } from './layouts/pwd-works-layout/pwd-works-layout.component';
import { AuthGuard } from './services/auth.guard';

const AppRoutes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'auth',
  //   pathMatch: 'full',
  // },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [{
      path: 'dashboard',
      loadChildren:()=> import('./pages/dashboard/dashboard.module').then(mod => mod.DashboardModule)
    }]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [{
      path: 'auth',
      loadChildren:()=> import('./pages/auth/auth.module').then(mod => mod.AuthModule)
    }]
  },
  {
    path: '',
    component: PwdEngrsLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'engrs',
        loadChildren:()=> import('./pages/pwd-engrs/pwd-engrs.module').then(mod => mod.PwdEngrsModule)
      },
      {
        path: 'jengrs',
        canActivate: [AuthGuard],
        loadChildren:()=> import('./pages/pwd-engrs/jengrs/jengrs.module').then(mod => mod.JengrsModule)
      },
      {
        path: 'aengrs',
        loadChildren:()=> import('./pages/pwd-engrs/aengrs/aengrs.module').then(mod => mod.AengrsModule)
      },
      {
        path: 'sengrs',
        loadChildren:()=> import('./pages/pwd-engrs/sengrs/sengrs.module').then(mod => mod.SengrsModule)
      }
    ]
  },
  
  {
    path: '',
    component: PwdWorksLayoutComponent,
    children: [
      {
        path: 'pwd-works',
        loadChildren:()=> import('./pages/pwd-works/pwd-works.module').then(mod => mod.PwdWorksModule)
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(AppRoutes,{
      useHash: false
    }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
