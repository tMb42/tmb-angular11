import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { NavbarModule } from 'src/app/components/navbar/navbar.module';
import { ProfileComponent } from '../dashboard/profile/profile.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { UsersComponent } from './users/users.component';
import { UserManageComponent } from './users/user-manage.component';
import { UserLayoutComponent } from './users/user-layout.component';
import { RolesComponent } from './roles/roles.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserActiveComponent } from './user-active/user-active.component';
import { UserBlackListComponent } from './user-black-list/user-black-list.component';

console.log('Test for Dashboard Module. Loaded Ok')

@NgModule({
  declarations: [ProfileComponent, UpdateProfileComponent, UserLayoutComponent, UsersComponent, UserManageComponent, RolesComponent, UserActiveComponent, UserBlackListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    PaginationModule,
    
    // MatButtonModule,
    // MatCardModule,
    // MatCheckboxModule,
    // MatFormFieldModule,
    // MatIconModule,
    
    DashboardRoutingModule,
    NavbarModule,
    NgMultiSelectDropDownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    CollapseModule.forRoot()
  ]
  
})
export class DashboardModule { }
