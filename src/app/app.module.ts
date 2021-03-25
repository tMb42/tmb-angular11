import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { PwdEngrsLayoutComponent } from './layouts/pwd-engrs-layout/pwd-engrs-layout.component';
import { PwdWorksLayoutComponent } from './layouts/pwd-works-layout/pwd-works-layout.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';

import { httpInterceptorProviders } from './http-interceptors';
import { AuthNavbarModule } from './components/auth-navbar/auth-navbar.module';
import { PwdEngrsNavbarModule } from './components/pwd-engrs-navbar/pwd-engrs-navbar.module';
import { NavbarModule } from './components/navbar/navbar.module';
import { PwdWorksNavbarModule } from './components/pwd-works-navbar/pwd-works-navbar.module';
import { SidebarModule } from './components/sidebar/sidebar.module';
import { FixedpluginModule } from './components/fixedplugin/fixedplugin.module';
import { FooterModule } from './components/footer/footer.module';
import { AlertComponent } from './components/alert/alert.component';
import { ProgressBarModule } from './components/progress-bar/progress-bar.module';


@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    AdminLayoutComponent,
    PwdEngrsLayoutComponent,
    PwdWorksLayoutComponent,
    AlertComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    FixedpluginModule,
    SidebarModule,
    FooterModule,
    AuthNavbarModule,
    ProgressBarModule,
    NavbarModule,
    PwdEngrsNavbarModule,
    PwdWorksNavbarModule,
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }


