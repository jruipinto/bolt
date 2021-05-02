import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtigoRowComponent } from '../artigo-row/artigo-row.component';
import { ArtigoRowListComponent } from './artigo-row-list.component';
import { RDataRowModule, RLoadingModule } from 'src/app/shared';

@NgModule({
  declarations: [ArtigoRowComponent, ArtigoRowListComponent],
  imports: [CommonModule, RLoadingModule, RDataRowModule],
  exports: [ArtigoRowComponent, ArtigoRowListComponent],
})
export class ArtigoRowListModule {}
