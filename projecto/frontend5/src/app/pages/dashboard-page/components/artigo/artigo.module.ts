import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RDataRowModule, RLoadingModule } from 'src/app/shared';
import { ArtigoRowListComponent } from './artigo-row-list/artigo-row-list.component';
import { ArtigoRowComponent } from './artigo-row/artigo-row.component';

@NgModule({
  declarations: [ArtigoRowComponent, ArtigoRowListComponent],
  imports: [CommonModule, RLoadingModule, RDataRowModule],
  exports: [ArtigoRowComponent, ArtigoRowListComponent],
})
export class ArtigoModule {}
