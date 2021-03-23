import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SengrsRoutingModule } from './sengrs-routing.module';
import { SeGradationComponent } from './se-gradation/se-gradation.component';

import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import {MatExpansionModule} from '@angular/material/expansion'; 

import { NgbAlertModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SePromotionComponent } from './se-promotion/se-promotion.component';
import { SeCasteComponent } from './se-caste/se-caste.component';
import { SeRetirementComponent } from './se-retirement/se-retirement.component';


console.log('Test for Sengrs Module. Loaded Ok')

@NgModule({
  declarations: [SeGradationComponent, SePromotionComponent, SeCasteComponent, SeRetirementComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule, 
    NgbAlertModule,
    SengrsRoutingModule,
    MatExpansionModule,
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    CollapseModule.forRoot()
  ]
})
export class SengrsModule { }
