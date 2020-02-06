import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutofixCommaDirective } from './autofix-comma.directive';



@NgModule({
  declarations: [AutofixCommaDirective],
  imports: [
    CommonModule
  ],
  exports: [AutofixCommaDirective]
})
export class AutofixCommaModule { }
