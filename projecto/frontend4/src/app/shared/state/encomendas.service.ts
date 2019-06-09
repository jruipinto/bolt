import { Injectable } from '@angular/core';
import { EncomendasApiService, AuthService } from 'src/app/shared/services';
import { EntityStateAbstraction } from 'src/app/shared/abstraction-classes';
import { Encomenda, EventoCronologico } from '..';

@Injectable({ providedIn: 'root' })
export class EncomendasService extends EntityStateAbstraction {

  constructor(
    protected encomendasAPI: EncomendasApiService,
    private authService: AuthService) {
    super(encomendasAPI);
  }

  public create(encomenda: Partial<Encomenda>) {
    const registo_cronologico: EventoCronologico[] = [{
      tecnico_user_id: this.authService.getUserId(),
      estado: encomenda.estado,
      updatedAt: new Date().toLocaleString() // dia/mes/ano, hora:minuto:segundo naquele momento
    }];
    return super.create({ ...encomenda, registo_cronologico } as Encomenda);
  }

  public patch(id: number, encomenda: Partial<Encomenda>) {
    const novoRegisto: EventoCronologico = {
      tecnico_user_id: this.authService.getUserId(),
      estado: encomenda.estado,
      updatedAt: new Date().toLocaleString()
    };
    const updatedRegistoCronologico: EventoCronologico[] = [
      ...encomenda.registo_cronologico,
      novoRegisto
    ];
    return super.patch(
      id,
      { ...encomenda, registo_cronologico: updatedRegistoCronologico } as Encomenda
    );
  }
}
