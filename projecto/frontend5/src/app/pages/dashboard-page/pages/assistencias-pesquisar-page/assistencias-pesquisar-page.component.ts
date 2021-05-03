import {
  Component,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { clone } from 'ramda';
import { AssistenciasService } from 'src/app/shared/state';
import { Assistencia, User } from 'src/app/shared';
import { ClientesPesquisarModalComponent } from 'src/app/pages/dashboard-page/modals';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@AutoUnsubscribe()
@Component({
  selector: 'app-assistencias-pesquisar-page',
  templateUrl: './assistencias-pesquisar-page.component.html',
  styleUrls: ['./assistencias-pesquisar-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssistenciasPesquisarPageComponent
  implements OnDestroy, AfterViewInit {
  @ViewChild('userSearchModalInput')
  userSearchModalInputEl: ElementRef<HTMLElement>;
  @ViewChild(ClientesPesquisarModalComponent)
  clientesSearchModal: ClientesPesquisarModalComponent;
  public results$: Observable<Assistencia[]>;
  public isLoading = true;

  public assistenciasSearchForm = this.fb.group({
    input: [null],
    estado: ['qualquer'],
    cliente: [null],
  });

  public estados = [
    'qualquer',
    'registado',
    'em transito',
    'recebido',
    'em análise',
    'contacto pendente',
    'não atendeu p/ cont.',
    'cliente adiou resp.',
    'contactado',
    'incontactável',
    'orçamento pendente',
    'não atendeu p/ orç.',
    'cliente adiou orç.',
    'orçamento aprovado',
    'orçamento recusado',
    'aguarda material',
    'material recebido',
    'concluído',
    'concluído s/ rep.',
    'entregue',
  ];

  constructor(
    private assistencias: AssistenciasService,
    private fb: FormBuilder
  ) {}

  ngAfterViewInit() {
    this.clientesSearchModal.selectedCliente.subscribe((user: User) =>
      this.assistenciasSearchForm.patchValue({ cliente: clone(user.id) })
    );
    this.searchAssistencia(this.assistenciasSearchForm.value);
  }

  ngOnDestroy() {}

  searchAssistencia({ input, estado, cliente }): void {
    if (!input && !cliente) {
      this.results$ = of([]);
      this.isLoading = false;
      return;
    }
    this.isLoading = true;

    const dbQuery = {
      query: {
        $sort: { id: '-1' },
        $limit: '200',
        $and: (input || ' ').split(' ').map((word) => ({
          $or: [
            { categoria: { $like: `%${word}%` } },
            { marca: { $like: `%${word}%` } },
            { modelo: { $like: `%${word}%` } },
            { cor: { $like: `%${word}%` } },
            { serial: { $like: `%${word}%` } },
            { problema: { $like: `%${word}%` } },
          ],
        })),
        ...(estado !== 'qualquer' ? { estado: estado } : null),
        ...(+cliente ? { cliente_user_id: +cliente } : null),
      },
    };

    this.results$ = this.assistencias.find(dbQuery).pipe(
      tap(() => {
        this.isLoading = false;
      })
    );
  }
}
