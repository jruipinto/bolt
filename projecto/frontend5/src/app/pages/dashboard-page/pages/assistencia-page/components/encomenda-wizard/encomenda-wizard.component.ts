import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ArtigoRowListComponent } from 'src/app/pages/dashboard-page/components/artigo/artigo-row-list/artigo-row-list.component';
import { Artigo, Assistencia, Encomenda } from 'src/app/shared';
import { AssistenciaPageService } from '../../assistencia-page.service';

@Component({
  selector: 'app-encomenda-wizard',
  templateUrl: './encomenda-wizard.component.html',
  styleUrls: ['./encomenda-wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EncomendaWizardComponent {
  @ViewChild('wizard') wizard;
  @ViewChild('wizardPageTwo') wizardPageTwo;
  @ViewChild(ArtigoRowListComponent) artigoRowList: ArtigoRowListComponent;

  @Input() assistencia: Assistencia = null;
  isModalOpen = false;
  results$: Observable<Artigo[]> = of([]);

  wizardEncomendaForm = this.fb.group({
    artigo_id: [null, [Validators.required]],
    artigo_marca: [null],
    artigo_modelo: [null],
    artigo_descricao: [null],
    assistencia_id: [null],
    observacao: [null],
    estado: ['nova'],
    previsao_entrega: [null, [Validators.required]],
    orcamento: [null],
    fornecedor: [null],
    qty: [null, [Validators.required]],
  });

  wizardArtigoSearchForm = this.fb.group({
    input: [null],
  });

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private pageSvc: AssistenciaPageService
  ) {}

  open(): void {
    this.isModalOpen = true;
    this.cdr.detectChanges();
  }

  addEncomenda(encomenda: Encomenda) {
    Object.assign(encomenda, {
      assistencia_id: this.assistencia.id,
      cliente_user_id: this.assistencia.cliente_user_id,
    });
    this.pageSvc.state.patch((draftState) => {
      draftState.assistenciaDraft.encomendas.push(encomenda);
      ++draftState.newEncomendasCounter;
    });
    this.wizard.reset();
  }

  selectArtigo(arg: Artigo) {
    const artigo = { ...arg };
    this.wizardEncomendaForm.patchValue({
      artigo_id: artigo.id,
      artigo_marca: artigo.marca,
      artigo_modelo: artigo.modelo,
      artigo_descricao: artigo.descricao,
    });
    this.wizard.next();
  }

  searchArtigo(input: string): void {
    this.results$ = this.artigoRowList.searchArtigo(input);
  }
}
