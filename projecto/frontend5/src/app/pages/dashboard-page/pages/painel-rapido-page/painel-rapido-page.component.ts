import {
  Component,
  AfterViewInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { AssistenciasService, EncomendasService } from 'src/app/shared/state';

@AutoUnsubscribe()
@Component({
  selector: 'app-painel-rapido-page',
  templateUrl: './painel-rapido-page.component.html',
  styleUrls: ['./painel-rapido-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PainelRapidoPageComponent implements AfterViewInit, OnDestroy {
  isLoadingEncomendas = true;
  isLoadingAssistencias = true;

  constructor(
    private assistencias: AssistenciasService,
    private encomendas: EncomendasService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.assistencias
      .find({
        query: {
          $limit: 200,
          estado: {
            $in: [
              'orçamento pendente',
              'não atendeu p/ orç.',
              'cliente adiou orç.',
              'contacto pendente',
              'não atendeu p/ cont.',
              'cliente adiou resp.',
            ],
          },
        },
      })
      .subscribe(() => {
        this.isLoadingAssistencias = false;
        this.cdr.detectChanges();
      });
    this.encomendas
      .find({
        query: {
          $limit: 200,
          estado: {
            $in: [
              'registada',
              'esgotada',
              'detectado defeito',
              'aguarda resposta de fornecedor',
            ],
          },
        },
      })
      .subscribe(() => {
        this.isLoadingEncomendas = false;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy() {}
}
