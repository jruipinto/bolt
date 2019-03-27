import { State } from '@ngxs/store';
import { Encomenda, Assistencia } from 'src/app/shared/models';

export interface PainelRapidoPageStateModel {
    encomendas: Encomenda[];
    orcamentos: Assistencia[];
    pedidosContactoCliente: Assistencia[];
}

/* Actions */
export class PullPainelRapidoPageState {
    static readonly type = '[Painel-Rapido-Page] Pulled from: assistencias api';
}

export class PushPainelRapidoPageState {
    static readonly type = '[Painel-Rapido-Page] Pushed to: assistencias api';
}

export class CreatePainelRapidoPageState {
    static readonly type = '[Painel-Rapido-Page] received "created" from: assistencias api';
    constructor(public assistencia: Assistencia) { }
}

export class PatchPainelRapidoPageState {
    static readonly type = '[Painel-Rapido-Page] received "patched" from: assistencias api';
    constructor(public assistencia: Assistencia) { }
}
/* ###### */

@State<PainelRapidoPageStateModel | null>({
    name: 'painelRapidoPage',
    defaults: null
})
export class PainelRapidoPageState {

    constructor() {
    }

}
