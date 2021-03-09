import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PwdEngrsRoutingModule } from './pwd-engrs-routing.module';

console.log('Test for PWD Engineers Module. Loaded Ok')

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PwdEngrsRoutingModule,
  ]
})
export class PwdEngrsModule { }
