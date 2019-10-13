import { Component, OnInit, OnDestroy } from '@angular/core';
import { concatMap, tap, map } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Encomenda, Assistencia } from 'src/app/shared/models';
import { EncomendasService, AssistenciasService } from 'src/app/shared/state';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { of } from 'rxjs';
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
    private assistencias: AssistenciasService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(
        concatMap((params: ParamMap) => this.encomendas.get(+params.get('id')))
      )
      .subscribe(
        (encomendas: Encomenda[]) => this.encomenda = encomendas[0]
      );
  }

  ngOnDestroy() { }
  /*
    saveEncomenda(newEstado: string, encomenda: Encomenda) {
      return this.encomendas.patch(encomenda.id, { ...encomenda, estado: newEstado })
        .pipe(
          tap(() => window.history.back())
        )
        .subscribe();
    }
    */
  notifyAssistencia = (encomenda: Encomenda) => {
    console.log(encomenda);
    if (!encomenda) { return of(alert('erro de comunicação com api')); }
    if (encomenda.assistencia_id) {
      return this.assistencias.get(encomenda.assistencia_id)
        .pipe(
          map(res => res[0]),
          concatMap((assistencia: Assistencia) => {
            const encomendasLeft = assistencia.encomendas.filter((e: Encomenda) => e.estado !== 'recebida' && e.estado !== 'entregue');
            console.log(encomendasLeft, encomendasLeft.length);
            if (encomendasLeft.length === 0) {
              return this.assistencias.patch(encomenda.assistencia_id, { ...assistencia, estado: 'material recebido' })
                .pipe(
                  concatMap(() => of([encomenda]))
                );
            }
            return of([encomenda]);
          })
        );
    }
    return of([encomenda]);
  }

  /*
  saveEncomenda(newEstado: string, encomenda: Encomenda) {
    if (newEstado === 'recebida' || newEstado === 'entregue') {
      if (encomenda.cliente_user_contacto === 918867376 || encomenda.assistencia_id) { // if encomenda for Stock of NReparações
        // or for any assistencia
        return this.encomendas.patch(encomenda.id, { ...encomenda, estado: 'entregue' })
          .pipe(
            tap(
              () => this.router.navigate(['/dashboard/artigo', encomenda.artigo_id])
            )
          )
          .subscribe();
      }
      return this.encomendas.patch(encomenda.id, { ...encomenda, estado: newEstado })
        .pipe(
          map(res => res[0]),
          concatMap(this.notifyAssistencia),
          tap(
            () => this.router.navigate(['/dashboard/artigo', encomenda.artigo_id])
          )
        )
        .subscribe();
    }
    return this.encomendas.patch(encomenda.id, { ...encomenda, estado: newEstado })
      .pipe(
        tap(() => window.history.back())
      )
      .subscribe();
  }
  */

  saveEncomenda(newEstado: string, encomenda: Encomenda) {
    if ((newEstado === 'recebida' || newEstado === 'entregue') && encomenda.cliente_user_contacto === 918867376) {
      return this.encomendas.patch(encomenda.id, { ...encomenda, estado: 'entregue' })
        .pipe(
          tap(
            () => this.router.navigate(['/dashboard/artigo', encomenda.artigo_id])
          )
        )
        .subscribe();
    }
    if ((newEstado === 'recebida' || newEstado === 'entregue') && encomenda.assistencia_id) {
      return this.encomendas.patch(encomenda.id, { ...encomenda, estado: 'entregue' })
        .pipe(
          map(res => res[0]),
          concatMap(this.notifyAssistencia),
          tap(
            () => this.router.navigate(['/dashboard/artigo', encomenda.artigo_id])
          )
        )
        .subscribe(/*() => alert(`👍 Assistência ${encomenda.assistencia_id} foi notificada da chegada de material!`)*/);
    }

    return this.encomendas.patch(encomenda.id, { ...encomenda, estado: newEstado })
      .pipe(
        tap(() => window.history.back())
      )
      .subscribe();
  }

  navigateBack() {
    window.history.back();
  }

  openAssistencia(assistenciaID: number) {
    return this.router.navigate(['/dashboard/assistencia', assistenciaID]);
  }

}
