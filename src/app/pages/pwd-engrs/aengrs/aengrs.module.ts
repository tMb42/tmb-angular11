import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import {MatExpansionModule} from '@angular/material/expansion'; 

import { AengrsRoutingModule } from './aengrs-routing.module';
import { AeGradationComponent } from './ae-gradation/ae-gradation.component';
import { AeCasteComponent } from './ae-caste/ae-caste.component';
import { AeConfirmationComponent } from './ae-confirmation/ae-confirmation.component';
import { AePromotionComponent } from './ae-promotion/ae-promotion.component';
import { AeRetirementComponent } from './ae-retirement/ae-retirement.component';


console.log('Test for Aengrs Module. Loaded Ok')

@NgModule({
  declarations: [AeGradationComponent, AeCasteComponent, AeConfirmationComponent, AePromotionComponent, AeRetirementComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AengrsRoutingModule,
    MatExpansionModule,
    AccordionModule.forRoot(),
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    CollapseModule.forRoot()
  ]
})
export class AengrsModule { }
