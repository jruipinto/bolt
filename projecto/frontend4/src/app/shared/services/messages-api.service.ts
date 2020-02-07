import { Injectable } from '@angular/core';

import { EntityApiAbstration } from 'src/app/shared/abstraction-classes';
import { FeathersService } from './feathers.service';
import { AuthService } from './auth.service';
import { Assistencia, Encomenda } from '../models';
import { gsm7bitConversionTable } from '../utilities';

@Injectable({
  providedIn: 'root'
})
export class MessagesApiService extends EntityApiAbstration {

  constructor(
    protected feathersService: FeathersService,
    private authService: AuthService) {
    super(feathersService, 'messages');
  }

  create(data: any, actionType?: string) {
    const parsedText = Array.from(data.text).map(character => {
      const specialCharacter = gsm7bitConversionTable.find(x => x.specialCharacter === character);
      if (specialCharacter) {
        return specialCharacter.replacement;
      } else {
        return character;
      }
    }).join('');
    return super.create({ ...data, text: parsedText }, actionType);
  }

  notificarOrcamentoDe(assistencia: Assistencia) {
    return this.create({
      phoneNumber: assistencia.cliente_user_contacto,
      // tslint:disable-next-line: max-line-length
      text: `Bom dia,\n\nN Reparações informa que o orçamento da assistência ${assistencia.id} é de ${assistencia.preco} €.\n\nObrigado.`,
      tecnico_user_id: this.authService.getUserId(),
      state: 'pending',
      subject: `Orçamento de A${assistencia.id}`
    });
  }

  notificarConclusaoDe(assistencia: Assistencia) {
    return this.create({
      phoneNumber: assistencia.cliente_user_contacto,
      // tslint:disable-next-line: max-line-length
      text: `Bom dia,\n\nN Reparações informa que a sua assistência ${assistencia.id} ${assistencia.estado === 'concluído' ? 'se encontra concluída' : 'não tem reparação'} e aguarda levantamento.\n\nObrigado.`,
      tecnico_user_id: this.authService.getUserId(),
      state: 'pending',
      subject: `Conclusão de A${assistencia.id}`
    });
  }

  notificarDisponibilidadeDe(encomenda: Encomenda) {
    if (encomenda.estado === 'adquirida') {
      return this.create({
        phoneNumber: encomenda.cliente_user_contacto,
        // tslint:disable-next-line: max-line-length
        text: `Bom dia,\n\nN Reparações informa que a sua encomenda ${encomenda.id} já foi adquirida e pode ser levantada apartir de amanhã.\n\nObrigado.`,
        tecnico_user_id: this.authService.getUserId(),
        state: 'pending',
        subject: `Notificação de E${encomenda.id}`
      });
    }
    if (encomenda.estado === 'esgotada') {
      return this.create({
        phoneNumber: encomenda.cliente_user_contacto,
        // tslint:disable-next-line: max-line-length
        text: `Bom dia,\n\nN Reparações informa que a sua encomenda ${encomenda.id} infelizmente não está disponível em fornecedor.\n\nObrigado.`,
        tecnico_user_id: this.authService.getUserId(),
        state: 'pending',
        subject: `Notificação de E${encomenda.id}`
      });
    }
    if (encomenda.estado === 'sem fornecedor') {
      return this.create({
        phoneNumber: encomenda.cliente_user_contacto,
        // tslint:disable-next-line: max-line-length
        text: `Bom dia,\n\nN Reparações informa que a sua encomenda ${encomenda.id} infelizmente não está disponível em fornecedor.\n\nObrigado.`,
        tecnico_user_id: this.authService.getUserId(),
        state: 'pending',
        subject: `Notificação de E${encomenda.id}`
      });
    }
    if (encomenda.estado === 'recebida') {
      return this.create({
        phoneNumber: encomenda.cliente_user_contacto,
        // tslint:disable-next-line: max-line-length
        text: `Bom dia,\n\nN Reparações informa que a sua encomenda ${encomenda.id} já chegou e aguarda levantamento.\n\nObrigado.`,
        tecnico_user_id: this.authService.getUserId(),
        state: 'pending',
        subject: `Notificação de E${encomenda.id}`
      });
    }
    if (encomenda.estado === 'detectado defeito') {
      return this.create({
        phoneNumber: encomenda.cliente_user_contacto,
        // tslint:disable-next-line: max-line-length
        text: `Bom dia,\n\nN Reparações informa que a sua encomenda ${encomenda.id} infelizmente chegou com defeito. Estamos em contacto com o fornecedor para tentar a substituição.\n\nObrigado.`,
        tecnico_user_id: this.authService.getUserId(),
        state: 'pending',
        subject: `Notificação de E${encomenda.id}`
      });
    }
  }

}
