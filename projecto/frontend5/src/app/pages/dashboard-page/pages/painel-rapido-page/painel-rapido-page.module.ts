import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PainelRapidoPageComponent } from './painel-rapido-page.component';
import { ClarityModule } from '@clr/angular';
import { EncomendasSectionComponent } from './components/encomendas-section/encomendas-section.component';
import { OrcamentosSectionComponent } from './components/orcamentos-section/orcamentos-section.component';
import { PContactSectionComponent } from './components/p-contact-section/p-contact-section.component';
import { RLoadingModule } from 'src/app/shared/components/r-loading/r-loading.module';

@NgModule({
  declarations: [
    PainelRapidoPageComponent,
    EncomendasSectionComponent,
    OrcamentosSectionComponent,
    PContactSectionComponent,
  ],
  imports: [CommonModule, ClarityModule, RLoadingModule],
  exports: [PainelRapidoPageComponent],
})
export class PainelRapidoPageModule {}
