import { Injectable } from '@angular/core';
import { AssistenciasApiService, AuthService } from 'src/app/shared/services';
import { EntityStateAbstraction } from 'src/app/shared/abstraction-classes';
import { Assistencia, EventoCronologico } from '../models';

@Injectable({ providedIn: 'root' })
export class AssistenciasService extends EntityStateAbstraction {

  constructor(
    protected assistenciasAPI: AssistenciasApiService,
    private authService: AuthService) {
    super(assistenciasAPI);
  }

  public create(assistencia: Partial<Assistencia>) {
    const registo_cronologico = JSON
      .stringify([{
        tecnico_user_id: this.authService.getUserId(),
        estado: 'recebido',
        updatedAt: new Date().toLocaleString() // dia/mes/ano, hora:minuto:segundo naquele momento
      }]);
    return super.create({ ...assistencia, registo_cronologico } as Assistencia);
  }

  public patch(id: number, assistencia: Partial<Assistencia>) {
    const novoRegisto: EventoCronologico = {
      tecnico_user_id: this.authService.getUserId(),
      estado: assistencia.estado,
      updatedAt: new Date().toLocaleString()
    };
    const updatedRegistoCronologico: EventoCronologico[] = [
      ...JSON.parse(assistencia.registo_cronologico),
      novoRegisto
    ];
    return super.patch(
      id,
      { ...assistencia, registo_cronologico: JSON.stringify(updatedRegistoCronologico) } as Assistencia
    );
  }
}
