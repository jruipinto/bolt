import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { RLoadingModule } from 'src/app/shared/components/r-loading/r-loading.module';
import { AssistenciaPageComponent } from './assistencia-page.component';
import { AccordionComponent } from './components/accordion/accordion.component';
import { AssistenciaInfoComponent } from './components/assistencia-info/assistencia-info.component';
import { ButtonsPanelComponent } from './components/buttons-panel/buttons-panel.component';
import { TechnicalReportComponent } from './components/technical-report/technical-report.component';
import {
  AutocapsModule,
  AutofocusModule,
  BackButtonModule,
  FormStateModule,
  RDataRowModule,
} from 'src/app/shared';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ArtigoSearchModalComponent } from './components/artigo-search-modal/artigo-search-modal.component';
import { EncomendaWizardComponent } from './components/encomenda-wizard/encomenda-wizard.component';
import { TecnicoSelectModalComponent } from './components/tecnico-select-modal/tecnico-select-modal.component';
import { AccordionContentMaterialComponent } from './components/accordion-content-material/accordion-content-material.component';
import { AccordionContentEncomendasComponent } from './components/accordion-content-encomendas/accordion-content-encomendas.component';
import { AccordionContentMessagesComponent } from './components/accordion-content-messages/accordion-content-messages.component';
import { AccordionContentRegistoComponent } from './components/accordion-content-registo/accordion-content-registo.component';
import { ArtigoModule } from '../../components/artigo/artigo.module';
import { AssistenciaPageService } from './assistencia-page.service';

@NgModule({
  providers: [AssistenciaPageService],
  declarations: [
    AssistenciaPageComponent,
    AccordionComponent,
    AssistenciaInfoComponent,
    ButtonsPanelComponent,
    TechnicalReportComponent,
    ArtigoSearchModalComponent,
    EncomendaWizardComponent,
    TecnicoSelectModalComponent,
    AccordionContentMaterialComponent,
    AccordionContentEncomendasComponent,
    AccordionContentMessagesComponent,
    AccordionContentRegistoComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ClarityModule,
    RLoadingModule,
    FormStateModule,
    AutocapsModule,
    AutofocusModule,
    BackButtonModule,
    RDataRowModule,
    ArtigoModule,
  ],
  exports: [AssistenciaPageComponent],
})
export class AssistenciaPageModule {}
