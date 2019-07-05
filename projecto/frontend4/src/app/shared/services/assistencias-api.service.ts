import { Injectable } from '@angular/core';
import { Observable, concat, of } from 'rxjs';
import { map, concatMap, toArray, mergeMap, tap } from 'rxjs/operators';

import { EntitiesApiAbstrationService } from 'src/app/shared/abstraction-classes';
import { FeathersService } from './feathers.service';
import { Assistencia, EventoCronologico, User, Artigo } from 'src/app/shared/models';
import { UsersService } from '../state/users.service';
import { ArtigosService } from '../state/artigos.service';
import { lensProp, view, set } from 'ramda';

@Injectable({
  providedIn: 'root'
})
export class AssistenciasApiService extends EntitiesApiAbstrationService {
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

  private assistenciaWithDetailedRegistoCronologico$ = (assistencia: Assistencia): Observable<Assistencia> =>
    this.detailedRegistoCronologico$(assistencia.registo_cronologico)
      .pipe(
        map((detailedRegistoCronologico$) =>
          ({ ...assistencia, registo_cronologico: detailedRegistoCronologico$ }))
      )

  private acceptClienteDetails = (cliente: User) =>
    (assistencia: Assistencia): Assistencia =>
      ({
        ...assistencia,
        cliente_user_name: cliente.nome,
        cliente_user_contacto: cliente.contacto
      })

  private deserialize(obj: {}, objPropName: string): {} {
    const lens = lensProp(objPropName);
    if (typeof view(lens, obj) === 'string') {
      return set(lens, JSON.parse(view(lens, obj)), obj);
    }
    return obj;
  }

  private fullyDetailedAssistencia$ = (assistenciaFromApi: Assistencia) =>
    this.usersAPI.get(assistenciaFromApi.cliente_user_id)
      .pipe(
        map(cliente => cliente[0]),
        map(this.acceptClienteDetails),
        map(curryAssistenciaWithClientDetails => curryAssistenciaWithClientDetails(assistenciaFromApi)),
        map(assistencia => this.deserialize(assistencia, 'registo_cronologico')),
        map(assistencia => this.deserialize(assistencia, 'material')),
        map(assistencia => this.deserialize(assistencia, 'encomendas')),
        concatMap(this.assistenciaWithDetailedRegistoCronologico$)
      )

  private fullyDetailedAssistenciasStream$ = (assistencias: Assistencia[]) =>
    concat(...assistencias.map(this.fullyDetailedAssistencia$))

  private fullyDetailedAssistencias$ = (assistencias$: Observable<Assistencia[]>) =>
    assistencias$
      .pipe(
        concatMap(this.fullyDetailedAssistenciasStream$),
        toArray()
      )

  private sanitize(arr: any[] | null): any[] | null {
    if (!arr) { return arr; }
    return arr.map(item => ({ id: item.id, qty: item.qty }));
  }

  constructor(
    protected feathersService: FeathersService,
    private usersService: UsersService,
    private artigosService: ArtigosService) {
    super(feathersService, 'assistencias');
  }


  find(query?: object) {
    const assistencias$ = super.find(query);
    return this.fullyDetailedAssistencias$(assistencias$);
  }

  get(id: number) {
    const assistencia$ = super.get(id) ;
    return this.fullyDetailedAssistencias$(assistencia$);
  }

  create(data: Assistencia, actionType?: string) {
    data = {
      ...data,
      material: this.sanitize(data.material),
      encomendas: this.sanitize(data.encomendas)
    };
    const assistencia$ = super.create(data);
    return this.fullyDetailedAssistencias$(assistencia$);
  }

  patch(id: number, data: Assistencia, actionType?: string) {
    data = {
      ...data,
      material: this.sanitize(data.material),
      encomendas: this.sanitize(data.encomendas)
    };
    const assistencia$ = super.patch(id, data);
    return this.fullyDetailedAssistencias$(assistencia$);
  }

  onCreated() {
    const assistencia$ = super.onCreated()
      .pipe(
        map(assistencias => assistencias[0]),
        mergeMap(this.fullyDetailedAssistencia$),
        map(assistencia => [assistencia])
      );
    return assistencia$;
  }

  onPatched() {
    const assistencia$ = super.onPatched()
      .pipe(
        map(assistencias => assistencias[0]),
        mergeMap(this.fullyDetailedAssistencia$),
        map(assistencia => [assistencia])
      );
    return assistencia$;
  }
}
