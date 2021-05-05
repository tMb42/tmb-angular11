import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';

import { SidebarComponent } from './sidebar.component';
import { AppRoutingModule } from '../../app-routing.module';

@NgModule({
    declarations: [
      SidebarComponent
    ],
    imports: [
      CommonModule,
      RouterModule,
      BrowserModule,
      BrowserAnimationsModule,
      // HttpClientModule,
      AppRoutingModule,
      MatToolbarModule,
      MatSidenavModule,
      MatListModule,
      MatIconModule,
    ],
    exports: [
      SidebarComponent
    ]
})

export class SidebarModule {}
