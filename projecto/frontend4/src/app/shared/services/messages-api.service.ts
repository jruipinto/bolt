import { Injectable } from '@angular/core';

import { EntityApiAbstration } from 'src/app/shared/abstraction-classes';
import { FeathersService } from './feathers.service';
import { AuthService } from './auth.service';
import { Assistencia, Encomenda } from '../models';

@Injectable({
    providedIn: 'root'
})
export class MessagesApiService extends EntityApiAbstration {

    constructor(
        protected feathersService: FeathersService,
        private authService: AuthService
    ) {
        super(feathersService, 'messages');
    }

    notificarOrcamentoDe(assistencia: Assistencia) {
        return this.create({
            phoneNumber: assistencia.cliente_user_contacto,
            // tslint:disable-next-line: max-line-length
            text: `Bom dia,\n\nN Reparações informa que o orcamento da assistência ${assistencia.id} é de ${assistencia.preco} €.\n\nObrigado.`,
            tecnico_user_id: this.authService.getUserId(),
            state: 'pending',
            subject: `Orçamento de A${assistencia.id}`
        });
    }

    notificarConclusaoDe(assistencia: Assistencia) {
        return this.create({
            phoneNumber: assistencia.cliente_user_contacto,
            // tslint:disable-next-line: max-line-length
            text: `Bom dia,\n\nNreparações informa que a sua assistência Nº${assistencia.id} ${assistencia.estado === 'concluído' ? 'se encontra concluída' : 'não tem reparação'} e aguarda levantamento.\n\nObrigado.`,
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
                text: `Bom dia,\n\nNreparações informa que a sua encomenda Nº${encomenda.id} já foi adquirida e pode ser levantada apartir de amanhã.\n\nObrigado.`,
                tecnico_user_id: this.authService.getUserId(),
                state: 'pending',
                subject: `Notificção de E${encomenda.id}`
            });
        }
        if (encomenda.estado === 'esgotada') {
            return this.create({
                phoneNumber: encomenda.cliente_user_contacto,
                // tslint:disable-next-line: max-line-length
                text: `Bom dia,\n\nNreparações informa que a sua encomenda Nº${encomenda.id} infelizmente não está disponível em fornecedor.\n\nObrigado.`,
                tecnico_user_id: this.authService.getUserId(),
                state: 'pending',
                subject: `Notificção de E${encomenda.id}`
            });
        }
        if (encomenda.estado === 'sem fornecedor') {
            return this.create({
                phoneNumber: encomenda.cliente_user_contacto,
                // tslint:disable-next-line: max-line-length
                text: `Bom dia,\n\nNreparações informa que a sua encomenda Nº${encomenda.id} infelizmente não está disponível em fornecedor.\n\nObrigado.`,
                tecnico_user_id: this.authService.getUserId(),
                state: 'pending',
                subject: `Notificção de E${encomenda.id}`
            });
        }
        if (encomenda.estado === 'recebida') {
            return this.create({
                phoneNumber: encomenda.cliente_user_contacto,
                // tslint:disable-next-line: max-line-length
                text: `Bom dia,\n\nNreparações informa que a sua encomenda Nº${encomenda.id} já chegou e aguarda levantamento.\n\nObrigado.`,
                tecnico_user_id: this.authService.getUserId(),
                state: 'pending',
                subject: `Notificção de E${encomenda.id}`
            });
        }
        if (encomenda.estado === 'detectado defeito') {
            return this.create({
                phoneNumber: encomenda.cliente_user_contacto,
                // tslint:disable-next-line: max-line-length
                text: `Bom dia,\n\nNreparações informa que a sua encomenda Nº${encomenda.id} infelizmente chegou com defeito. Estamos em contacto com o fornecedor para tentar a substituição.\n\nObrigado.`,
                tecnico_user_id: this.authService.getUserId(),
                state: 'pending',
                subject: `Notificção de E${encomenda.id}`
            });
        }
    }

}

const specialCharactersConversionTable = [
    {
        specialCharacter: '@',
        replacement: '\x00'
    },
    {
        specialCharacter: '%',
        replacement: '\x25'
    },
    {
        specialCharacter: '€',
        replacement: 'Eur'
    },
    {
        specialCharacter: '$',
        replacement: '\x02'
    },
    {
        specialCharacter: 'ç',
        replacement: 'c'
    },
    {
        specialCharacter: 'à',
        replacement: '\x7f'
    },
    {
        specialCharacter: 'á',
        replacement: 'a'
    },
    {
        specialCharacter: 'ã',
        replacement: 'a'
    },
    {
        specialCharacter: 'â',
        replacement: 'a'
    },
    {
        specialCharacter: 'è',
        replacement: '\x04'
    },
    {
        specialCharacter: 'é',
        replacement: '\x05'
    },
    {
        specialCharacter: 'ê',
        replacement: 'e'
    },
    {
        specialCharacter: 'ì',
        replacement: 'i'
    },
    {
        specialCharacter: 'í',
        replacement: 'i'
    },
    {
        specialCharacter: 'ò',
        replacement: '\x08'
    },
    {
        specialCharacter: 'ó',
        replacement: 'o'
    },
    {
        specialCharacter: 'õ',
        replacement: 'o'
    },
    {
        specialCharacter: 'ô',
        replacement: 'o'
    },
    {
        specialCharacter: 'ù',
        replacement: '\x06'
    },
    {
        specialCharacter: 'ú',
        replacement: 'u'
    },
    {
        specialCharacter: 'û',
        replacement: 'u'
    },



    {
        specialCharacter: 'Ç',
        replacement: 'C'
    },
    {
        specialCharacter: 'À',
        replacement: '\x7f'
    },
    {
        specialCharacter: 'Á',
        replacement: 'A'
    },
    {
        specialCharacter: 'Ã',
        replacement: 'A'
    },
    {
        specialCharacter: 'Â',
        replacement: 'A'
    },
    {
        specialCharacter: 'È',
        replacement: '\x04'
    },
    {
        specialCharacter: 'É',
        replacement: '\x1f'
    },
    {
        specialCharacter: 'Ê',
        replacement: 'E'
    },
    {
        specialCharacter: 'Ì',
        replacement: 'I'
    },
    {
        specialCharacter: 'Í',
        replacement: 'I'
    },
    {
        specialCharacter: 'Ò',
        replacement: '\x08'
    },
    {
        specialCharacter: 'Ó',
        replacement: 'O'
    },
    {
        specialCharacter: 'Õ',
        replacement: 'O'
    },
    {
        specialCharacter: 'Ô',
        replacement: 'O'
    },
    {
        specialCharacter: 'Ù',
        replacement: '\x06'
    },
    {
        specialCharacter: 'Ú',
        replacement: 'U'
    },
    {
        specialCharacter: 'Û',
        replacement: 'U'
    },
];
