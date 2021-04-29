import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from './back-button.component';
import { ClarityModule } from '@clr/angular';

@NgModule({
  declarations: [BackButtonComponent],
  imports: [CommonModule, ClarityModule],
  exports: [BackButtonComponent],
})
export class BackButtonModule {}
