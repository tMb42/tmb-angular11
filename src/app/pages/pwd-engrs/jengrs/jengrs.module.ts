import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import {MatExpansionModule} from '@angular/material/expansion'; 

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { JengrsRoutingModule } from './jengrs-routing.module';
import { JeGradationComponent } from './je-gradation/je-gradation.component';
import { JePromotionComponent } from './je-promotion/je-promotion.component';
import { JeCasteComponent } from './je-caste/je-caste.component';
import { JeRetirementComponent } from './je-retirement/je-retirement.component';
import { JePassedComponent } from './je-passed/je-passed.component';


console.log('Test for Jengrs Module. Loaded Ok')

@NgModule({
  declarations: [JeGradationComponent, JePromotionComponent, JeCasteComponent, JeRetirementComponent, JePassedComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    JengrsRoutingModule,
    MatExpansionModule,
    NgxDatatableModule,
    AccordionModule.forRoot(),
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    CollapseModule.forRoot()   
  ]
})
export class JengrsModule { }
