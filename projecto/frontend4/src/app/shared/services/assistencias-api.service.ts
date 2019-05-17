import { Injectable } from '@angular/core';
import { Observable, concat } from 'rxjs';
import { map, concatMap, toArray, mergeMap } from 'rxjs/operators';

import { EntitiesApiAbstrationService } from 'src/app/shared/abstraction-classes';
import { FeathersService } from './feathers.service';
import { Assistencia, EventoCronologico, User } from 'src/app/shared/models';
import { UsersService } from '../state/users.service';

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

  private assistenciaWithParsedRegistoCronologico = (assistencia: Assistencia): Assistencia =>
    typeof assistencia.registo_cronologico === 'string'
      ? { ...assistencia, registo_cronologico: JSON.parse(assistencia.registo_cronologico) }
      : assistencia

  private fullyDetailedAssistencia$ = (assistenciaFromApi: Assistencia) =>
    this.usersAPI.get(assistenciaFromApi.cliente_user_id)
      .pipe(
        map(cliente => cliente[0]),
        map(this.acceptClienteDetails),
        map(curryAssistenciaWithClientDetails => curryAssistenciaWithClientDetails(assistenciaFromApi)),
        map(this.assistenciaWithParsedRegistoCronologico),
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

  constructor(protected feathersService: FeathersService, private usersService: UsersService) {
    super(feathersService, 'assistencias');
  }

  find(query?: object) {
    const assistencias$ = super.find(query);
    return this.fullyDetailedAssistencias$(assistencias$);
  }

  get(id: number) {
    const assistencia$ = super.get(id);
    return this.fullyDetailedAssistencias$(assistencia$);
  }

  create(data: object, actionType?: string) {
    const assistencia$ = super.create(data);
    return this.fullyDetailedAssistencias$(assistencia$);
  }

  patch(id: number, data: object, actionType?: string) {
    const assistencia$ = super.patch(id, data);
    return this.fullyDetailedAssistencias$(assistencia$);
  }

  onCreated() {
    const assistencia$ = super.onCreated().pipe(
      map(assistencias => assistencias[0]),
      mergeMap(this.fullyDetailedAssistencia$),
      map(assistencia => [assistencia]))
      ;
    return assistencia$;
  }

  onPatched() {
    const assistencia$ = super.onPatched().pipe(
      map(assistencias => assistencias[0]),
      mergeMap(this.fullyDetailedAssistencia$),
      map(assistencia => [assistencia])
    );
    return assistencia$;
  }

}
