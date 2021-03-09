import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavbarComponent } from './navbar.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';

@NgModule({
    declarations: [ NavbarComponent ],
    imports: [ 
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,    
        MatMenuModule,
        MatListModule 
    ],    
    exports: [ NavbarComponent ]
})

export class NavbarModule {}
