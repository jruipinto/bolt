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
import { Encomenda } from 'src/app/shared';
import { EncomendasService } from 'src/app/shared/state';

@AutoUnsubscribe()
@Component({
  selector: 'app-encomendas-section',
  templateUrl: './encomendas-section.component.html',
  styleUrls: ['./encomendas-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EncomendasSectionComponent implements OnDestroy {
  @Input() isLoading: boolean = true;

  encomendas$: Observable<Encomenda[]> = this.encomendas.state$.pipe(
    map((encomendas: Encomenda[]) =>
      encomendas
        ? encomendas.filter(
            (encomenda) =>
              encomenda.estado === 'registada' ||
              encomenda.estado === 'esgotada' ||
              encomenda.estado === 'detectado defeito' ||
              encomenda.estado === 'aguarda resposta de fornecedor'
          )
        : null
    )
  );

  constructor(private encomendas: EncomendasService, private router: Router) {}

  ngOnDestroy(): void {}

  openEncomenda(id: number) {
    this.router.navigate(['/dashboard/encomenda', id]);
  }

  saveEncomenda(newEstado: string, encomenda: Encomenda) {
    this.encomendas
      .patch(encomenda.id, { ...encomenda, estado: newEstado }, 'novo estado')
      .subscribe();
  }
}
