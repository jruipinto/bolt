import { Injectable } from '@angular/core';
import { EntityStateAbstraction } from 'src/app/shared/abstraction-classes';
import { EncomendasApiService, AuthService } from 'src/app/shared/services';
import { Encomenda, EventoCronologico } from 'src/app/shared/models';

@Injectable({ providedIn: 'root' })
export class EncomendasService extends EntityStateAbstraction {

  constructor(
    protected encomendasAPI: EncomendasApiService,
    private authService: AuthService) {
    super(encomendasAPI);
  }

  public create(encomenda: Partial<Encomenda>) {
    const registo_cronologico: EventoCronologico[] = [{
      editor_user_id: this.authService.getUserId(),
      editor_action: 'novo estado',
      estado: encomenda.estado,
      updatedAt: new Date().toLocaleString() // dia/mes/ano, hora:minuto:segundo naquele momento
    }];
    return super.create({ ...encomenda, registo_cronologico } as Encomenda);
  }

  public patch(id: number, encomenda: Partial<Encomenda>, editor_action?: 'novo estado' | 'edição') {
    const novoRegisto: EventoCronologico = {
      editor_user_id: this.authService.getUserId(),
      editor_action,
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
