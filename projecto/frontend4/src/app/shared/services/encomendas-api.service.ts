import { Injectable } from '@angular/core';
import { Observable, concat } from 'rxjs';
import { map, concatMap, toArray, mergeMap, tap } from 'rxjs/operators';

import { EntitiesApiAbstrationService } from 'src/app/shared/abstraction-classes';
import { FeathersService } from 'src/app/shared/services/feathers.service';
import { EventoCronologico, User, Encomenda, Artigo } from 'src/app/shared/models';
import { UsersService } from 'src/app/shared/state/users.service';
import { ArtigosService } from 'src/app/shared/state/artigos.service';

@Injectable({
  providedIn: 'root'
})
export class EncomendasApiService extends EntitiesApiAbstrationService {
  private usersAPI = this.usersService;

  private detailedEventoCronologico$ = (evento: EventoCronologico): Observable<EventoCronologico> =>
    this.usersAPI.get(evento.tecnico_user_id)
      .pipe(
        map((user: User[]) => ({ ...evento, tecnico: user[0].nome }))
      )

  private detailedRegistoCronologico$ = (registoCronologico: EventoCronologico[]) =>
    concat([...registoCronologico.map(this.detailedEventoCronologico$)])
      .pipe(
        concatMap(concats => concats),
        toArray()
      )

  private encomendaWithDetailedRegistoCronologico$ = (encomenda: Encomenda): Observable<Encomenda> =>
    this.detailedRegistoCronologico$(encomenda.registo_cronologico)
      .pipe(
        map((detailedRegistoCronologico$) =>
          ({ ...encomenda, registo_cronologico: detailedRegistoCronologico$ }))
      )

  private acceptClienteDetails = (cliente: User) =>
    (encomenda: Encomenda): Encomenda =>
      ({
        ...encomenda,
        cliente_user_name: cliente.nome,
        cliente_user_contacto: cliente.contacto
      })

  private encomendaWithParsedRegistoCronologico = (encomenda: Encomenda): Encomenda =>
    typeof encomenda.registo_cronologico === 'string'
      ? { ...encomenda, registo_cronologico: JSON.parse(encomenda.registo_cronologico) }
      : encomenda

  private encomendaWithArtigoDetails$ = (encomenda: Encomenda) => this.artigosService.get(encomenda.artigo_id)
    .pipe(
      map((artigos: Artigo[]) => artigos[0]),
      map(
        (artigo: Artigo) => {
          return {
            ...encomenda,
            artigo_marca: artigo.marca,
            artigo_modelo: artigo.modelo,
            artigo_descricao: artigo.descricao
          };
        }
      )
    )

  private fullyDetailedEncomenda$ = (encomendaFromApi: Encomenda) =>
    this.usersAPI.get(encomendaFromApi.cliente_user_id)
      .pipe(
        map(cliente => cliente[0]),
        map(this.acceptClienteDetails),
        map(curryEncomendaWithClientDetails => curryEncomendaWithClientDetails(encomendaFromApi)),
        map(this.encomendaWithParsedRegistoCronologico),
        concatMap(this.encomendaWithDetailedRegistoCronologico$),
        concatMap(this.encomendaWithArtigoDetails$)
      )

  private fullyDetailedEncomendasStream$ = (encomendas: Encomenda[]) =>
    concat(...encomendas.map(this.fullyDetailedEncomenda$))

  private fullyDetailedEncomendas$ = (encomendas$: Observable<Encomenda[]>) =>
    encomendas$
      .pipe(
        concatMap(this.fullyDetailedEncomendasStream$),
        toArray()
      )

  constructor(
    protected feathersService: FeathersService,
    private usersService: UsersService,
    private artigosService: ArtigosService) {
    super(feathersService, 'encomendas');
  }


  find(query?: object) {
    const encomendas$ = super.find(query);
    return this.fullyDetailedEncomendas$(encomendas$);
  }

  get(id: number) {
    const encomenda$ = super.get(id);
    return this.fullyDetailedEncomendas$(encomenda$);
  }

  create(data: object, actionType?: string) {
    const encomenda$ = super.create(data);
    return this.fullyDetailedEncomendas$(encomenda$);
  }

  patch(id: number, data: object, actionType?: string) {
    const encomenda$ = super.patch(id, data);
    return this.fullyDetailedEncomendas$(encomenda$);
  }

  onCreated() {
    const encomenda$ = super.onCreated()
      .pipe(
        map(encomendas => encomendas[0]),
        mergeMap(this.fullyDetailedEncomenda$),
        map(encomenda => [encomenda])
      );
    return encomenda$;
  }

  onPatched() {
    const encomenda$ = super.onPatched()
      .pipe(
        map(encomendas => encomendas[0]),
        mergeMap(this.fullyDetailedEncomenda$),
        map(encomenda => [encomenda])
      );
    return encomenda$;
  }
}
