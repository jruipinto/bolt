import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RLoadingComponent } from './r-loading.component';
import { ClarityModule } from '@clr/angular';

@NgModule({
  declarations: [RLoadingComponent],
  imports: [CommonModule, ClarityModule],
  exports: [RLoadingComponent],
})
export class RLoadingModule {}
