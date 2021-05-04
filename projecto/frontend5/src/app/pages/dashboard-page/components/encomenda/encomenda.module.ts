import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RLoadingModule, RDataRowModule } from 'src/app/shared';
import { EncomendaRowComponent } from './encomenda-row/encomenda-row.component';
import { EncomendaRowListComponent } from './encomenda-row-list/encomenda-row-list.component';

@NgModule({
  declarations: [EncomendaRowComponent, EncomendaRowListComponent],
  imports: [CommonModule, RLoadingModule, RDataRowModule],
  exports: [EncomendaRowComponent, EncomendaRowListComponent],
})
export class EncomendaModule {}
