import { State } from '@ngxs/store';
import { Encomenda, Assistencia } from 'src/app/shared/models';

export interface PainelRapidoPageStateModel {
    encomendas: Encomenda[];
    orcamentos: Assistencia[];
    pedidosContactoCliente: Assistencia[];
}

/* Actions for encomendas */
export class FindEncomendas {
    static readonly type = '[Encomendas API] Find Encomendas';
}

export class PostEncomendas {
    static readonly type = '[Painel-Rapido-Page] Post Encomenda';
}

export class CreatePainelRapidoPageEncomendas {
    static readonly type = '[Painel-Rapido-Page] received PainelRapidoPageState.encomendas "created" from: Encomendas api';
    constructor(public encomenda: Encomenda) { }
}

export class PatchPainelRapidoPageEncomendas {
    static readonly type = '[Painel-Rapido-Page] received PainelRapidoPageState.encomendas "patched" from: Encomendas api';
    constructor(public encomenda: Encomenda) { }
}
/* ###### */

/* Actions for orcamentos */
export class PullPainelRapidoPageOrcamentos {
    static readonly type = '[Painel-Rapido-Page] Pulled PainelRapidoPageState.orcamentos from: Assistencias api';
}

export class PushPainelRapidoPageOrcamentos {
    static readonly type = '[Painel-Rapido-Page] Pushed PainelRapidoPageState.orcamentos to: Assistencias api';
}

export class CreatePainelRapidoPageOrcamentos {
    static readonly type = '[Painel-Rapido-Page] received PainelRapidoPageState.orcamentos "created" from: Assistencias api';
    constructor(public assistencia: Assistencia) { }
}

export class PatchPainelRapidoPageOrcamentos {
    static readonly type = '[Painel-Rapido-Page] received PainelRapidoPageState.orcamentos"patched" from: Assistencias api';
    constructor(public assistencia: Assistencia) { }
}
/* ###### */

/* Actions for pedidosContactoCliente */
export class PullPainelRapidoPagePedidosContactoCliente {
    static readonly type = '[Painel-Rapido-Page] Pulled PainelRapidoPageState.pedidosContactoCliente from: Assistencias api';
}

export class PushPainelRapidoPagePedidosContactoCliente {
    static readonly type = '[Painel-Rapido-Page] Pushed PainelRapidoPageState.pedidosContactoCliente to: Assistencias api';
}

export class CreatePainelRapidoPagePedidosContactoCliente {
    static readonly type = '[Painel-Rapido-Page] received PainelRapidoPageState.pedidosContactoCliente "created" from: Assistencias api';
    constructor(public assistencia: Assistencia) { }
}

export class PatchPainelRapidoPagePedidosContactoCliente {
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
