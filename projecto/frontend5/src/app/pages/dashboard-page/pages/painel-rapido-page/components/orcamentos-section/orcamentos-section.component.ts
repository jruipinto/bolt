import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Assistencia } from 'src/app/shared/models';
import { AssistenciasService } from 'src/app/shared/state';

@AutoUnsubscribe()
@Component({
  selector: 'app-orcamentos-section',
  templateUrl: './orcamentos-section.component.html',
  styleUrls: ['./orcamentos-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrcamentosSectionComponent implements OnDestroy {
  @Input() isLoading: boolean = true;

  orcamentos$: Observable<
    Partial<Assistencia[]>
  > = this.assistencias.state$.pipe(
    map((state) =>
      state
        ? state.filter(
            (assistencia) =>
              assistencia.estado === 'orçamento pendente' ||
              assistencia.estado === 'não atendeu p/ orç.' ||
              assistencia.estado === 'cliente adiou orç.'
          )
        : null
    )
  );

  constructor(
    private assistencias: AssistenciasService,
    private router: Router
  ) {}

  ngOnDestroy(): void {}

  openAssistencia(id: number) {
    this.router.navigate(['/dashboard/assistencia', id]);
  }

  saveAssist(newEstado: string, assistencia: Assistencia) {
    this.assistencias
      .patch(assistencia.id, { ...assistencia, estado: newEstado })
      .subscribe();
  }
}
