import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Artigo, Assistencia, Encomenda } from 'src/app/shared';

@Component({
  selector: 'app-encomenda-wizard',
  templateUrl: './encomenda-wizard.component.html',
  styleUrls: ['./encomenda-wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EncomendaWizardComponent {
  @ViewChild('wizard') wizard;
  @ViewChild('wizardPageTwo') wizardPageTwo;

  @Input() assistencia: Assistencia = null;
  isModalOpen = false;
  newEncomendasCounter = 0;
  artigoSearchResults: Artigo[] = [];

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

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

  open(): void {
    this.isModalOpen = true;
    this.cdr.detectChanges();
  }

  addEncomenda(arg: Encomenda) {
    const encomenda = {
      ...arg,
      assistencia_id: this.assistencia.id,
      cliente_user_id: this.assistencia.cliente_user_id,
    };
    this.assistencia.encomendas
      ? (this.assistencia.encomendas = [
          ...this.assistencia.encomendas,
          encomenda,
        ])
      : (this.assistencia.encomendas = [encomenda]);
    this.wizard.reset();
    ++this.newEncomendasCounter;
  }

  patchWizardEncomendaForm(arg: Artigo) {
    const artigo = { ...arg };
    this.wizardEncomendaForm.patchValue({
      artigo_id: artigo.id,
      artigo_marca: artigo.marca,
      artigo_modelo: artigo.modelo,
      artigo_descricao: artigo.descricao,
    });
    this.wizard.navService.currentPage = this.wizardPageTwo;
  }

  searchArtigo(arg: string): void {}
}
