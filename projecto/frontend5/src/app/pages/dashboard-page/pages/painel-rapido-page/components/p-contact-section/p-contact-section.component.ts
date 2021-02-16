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
import { Assistencia } from 'src/app/shared';
import { AssistenciasService } from 'src/app/shared/state';

@AutoUnsubscribe()
@Component({
  selector: 'app-p-contact-section',
  templateUrl: './p-contact-section.component.html',
  styleUrls: ['./p-contact-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PContactSectionComponent implements OnDestroy {
  @Input() isLoading: boolean = true;

  pedidosContactoCliente$: Observable<
    Partial<Assistencia[]>
  > = this.assistencias.state$.pipe(
    map((state) =>
      state
        ? state.filter(
            (assistencia) =>
              assistencia.estado === 'contacto pendente' ||
              assistencia.estado === 'não atendeu p/ cont.' ||
              assistencia.estado === 'cliente adiou resp.'
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
