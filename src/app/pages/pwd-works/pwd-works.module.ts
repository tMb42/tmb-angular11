import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PwdWorksRoutingModule } from './pwd-works-routing.module';
import { TenderDetailsComponent } from './tender-details/tender-details.component';

import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from "@angular/material/dialog";
import {MatTabsModule} from '@angular/material/tabs';

import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PwdWorkingProfileComponent } from './pwd-working-profile/pwd-working-profile.component';
import { TenderComponent } from './cpanel/tender/tender.component';
import { TenderEditComponent } from './cpanel/tender-edit/tender-edit.component';
import { SecurityComponent } from './security/security.component';

@NgModule({
  declarations: [TenderDetailsComponent, PwdWorkingProfileComponent, TenderComponent, TenderEditComponent, SecurityComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule,
    PwdWorksRoutingModule,
    FontAwesomeModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatTabsModule,
    MatDialogModule,
    AccordionModule.forRoot(),
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    CollapseModule.forRoot()
  ]
})
export class PwdWorksModule { }
