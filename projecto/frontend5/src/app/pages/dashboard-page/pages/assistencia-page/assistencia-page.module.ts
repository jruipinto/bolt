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
  FormStateModule,
} from 'src/app/shared';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ArtigoSearchModalComponent } from './components/artigo-search-modal/artigo-search-modal.component';

@NgModule({
  declarations: [
    AssistenciaPageComponent,
    AccordionComponent,
    AssistenciaInfoComponent,
    ButtonsPanelComponent,
    TechnicalReportComponent,
    ArtigoSearchModalComponent,
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
  ],
  exports: [AssistenciaPageComponent],
})
export class AssistenciaPageModule {}
