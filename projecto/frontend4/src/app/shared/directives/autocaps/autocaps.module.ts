import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutocapsDirective } from './autocaps.directive';



@NgModule({
  declarations: [AutocapsDirective],
  imports: [
    CommonModule
  ],
  exports: [AutocapsDirective]
})
export class AutocapsModule { }
