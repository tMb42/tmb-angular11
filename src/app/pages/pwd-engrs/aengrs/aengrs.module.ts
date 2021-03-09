import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AengrsRoutingModule } from './aengrs-routing.module';
import { AeGradationComponent } from './ae-gradation/ae-gradation.component';

console.log('Test for Aengrs Module. Loaded Ok')

@NgModule({
  declarations: [AeGradationComponent],
  imports: [
    CommonModule,
    AengrsRoutingModule
  ]
})
export class AengrsModule { }
