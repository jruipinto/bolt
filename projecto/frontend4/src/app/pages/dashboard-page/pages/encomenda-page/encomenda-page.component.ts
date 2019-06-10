import { Component, OnInit, OnDestroy } from '@angular/core';
import { concatMap, tap } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Encomenda } from 'src/app/shared/models';
import { EncomendasService } from 'src/app/shared/state';
import { ActivatedRoute, ParamMap } from '@angular/router';
@AutoUnsubscribe()
@Component({
  selector: 'app-encomenda-page',
  templateUrl: './encomenda-page.component.html',
  styleUrls: ['./encomenda-page.component.scss']
})
export class EncomendaPageComponent implements OnInit, OnDestroy {
  public encomenda: Encomenda;

  constructor(
    private encomendas: EncomendasService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(
        concatMap((params: ParamMap) => this.encomendas.getAndWatch(+params.get('id')))
      )
      .subscribe(
        (encomendas: Encomenda[]) => this.encomenda = encomendas[0]
      );
  }

  ngOnDestroy() { }

  saveEncomenda(newEstado: string, encomenda: Encomenda) {
    return this.encomendas.patch(encomenda.id, { ...encomenda, estado: newEstado })
      .pipe(
        tap(() => window.history.back())
      )
      .subscribe();
  }

}
