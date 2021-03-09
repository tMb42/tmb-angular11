import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PwdEngrsNavbarComponent } from './pwd-engrs-navbar.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';


@NgModule({
  declarations: [PwdEngrsNavbarComponent],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,    
    MatMenuModule,
    MatListModule
  ],
  exports: [
    PwdEngrsNavbarComponent,
  ]
})
export class PwdEngrsNavbarModule { }
