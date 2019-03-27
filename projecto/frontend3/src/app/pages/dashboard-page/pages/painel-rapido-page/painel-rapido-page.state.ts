import { State } from '@ngxs/store';
import { Encomenda, Assistencia } from 'src/app/shared/models';

export interface PainelRapidoPageStateModel {
    encomendas: Encomenda[];
    orcamentos: Assistencia[];
    pedidosContactoCliente: Assistencia[];
}

/* Actions for encomendas */
export class PullPainelRapidoPageEncomendasState {
    static readonly type = '[Painel-Rapido-Page] Pulled PainelRapidoPageState.encomendas from: Encomendas api';
}

export class PushPainelRapidoPageEncomendasState {
    static readonly type = '[Painel-Rapido-Page] Pushed PainelRapidoPageState.encomendas to: Encomendas api';
}

export class CreatePainelRapidoPageEncomendasState {
    static readonly type = '[Painel-Rapido-Page] received PainelRapidoPageState.encomendas "created" from: Encomendas api';
    constructor(public encomenda: Encomenda) { }
}

export class PatchPainelRapidoPageEncomendasState {
    static readonly type = '[Painel-Rapido-Page] received PainelRapidoPageState.encomendas "patched" from: Encomendas api';
    constructor(public encomenda: Encomenda) { }
}
/* ###### */

/* Actions for orcamentos */
export class PullPainelRapidoPageOrcamentosState {
    static readonly type = '[Painel-Rapido-Page] Pulled PainelRapidoPageState.orcamentos from: Assistencias api';
}

export class PushPainelRapidoPageOrcamentosState {
    static readonly type = '[Painel-Rapido-Page] Pushed PainelRapidoPageState.orcamentos to: Assistencias api';
}

export class CreatePainelRapidoPageOrcamentosState {
    static readonly type = '[Painel-Rapido-Page] received PainelRapidoPageState.orcamentos "created" from: Assistencias api';
    constructor(public assistencia: Assistencia) { }
}

export class PatchPainelRapidoPageOrcamentosState {
    static readonly type = '[Painel-Rapido-Page] received PainelRapidoPageState.orcamentos"patched" from: Assistencias api';
    constructor(public assistencia: Assistencia) { }
}
/* ###### */

/* Actions for pedidosContactoCliente */
export class PullPainelRapidoPagePedidosContactoClienteState {
    static readonly type = '[Painel-Rapido-Page] Pulled PainelRapidoPageState.pedidosContactoCliente from: Assistencias api';
}

export class PushPainelRapidoPagePedidosContactoClienteState {
    static readonly type = '[Painel-Rapido-Page] Pushed PainelRapidoPageState.pedidosContactoCliente to: Assistencias api';
}

export class CreatePainelRapidoPagePedidosContactoClienteState {
    static readonly type = '[Painel-Rapido-Page] received PainelRapidoPageState.pedidosContactoCliente "created" from: Assistencias api';
    constructor(public assistencia: Assistencia) { }
}

export class PatchPainelRapidoPagePedidosContactoClienteState {
    static readonly type = '[Painel-Rapido-Page] received PainelRapidoPageState.pedidosContactoCliente "patched" from: Assistencias api';
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
