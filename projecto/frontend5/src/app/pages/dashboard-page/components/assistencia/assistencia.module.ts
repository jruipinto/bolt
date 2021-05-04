import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RLoadingModule, RDataRowModule } from 'src/app/shared';
import { AssistenciaRowComponent } from './assistencia-row/assistencia-row.component';
import { AssistenciaRowListComponent } from './assistencia-row-list/assistencia-row-list.component';
import { ClarityModule } from '@clr/angular';

@NgModule({
  declarations: [AssistenciaRowComponent, AssistenciaRowListComponent],
  imports: [CommonModule, RLoadingModule, RDataRowModule, ClarityModule],
  exports: [AssistenciaRowComponent, AssistenciaRowListComponent],
})
export class AssistenciaModule {}
