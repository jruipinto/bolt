import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormStateDirective } from './form-state.directive';



@NgModule({
  declarations: [FormStateDirective],
  imports: [CommonModule],
  exports: [FormStateDirective]
})
export class FormStateModule { }
