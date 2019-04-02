import { Injector } from '@angular/core';
import { State, StateContext, Action } from '@ngxs/store';
import { Encomenda, Assistencia } from 'src/app/shared/models';
import { FeathersService } from 'src/app/shared/services';

export interface PainelRapidoPageStateModel {
    encomendas: Encomenda[];
    orcamentos: Assistencia[];
    pedidosContactoCliente: Assistencia[];
}

/* Actions for encomendas */
export class PainelRapidoFindEncomendas {
    static readonly type = '[Encomendas API] Find Encomendas';
}

export class PainelRapidoPostEncomenda {
    static readonly type = '[Painel-Rapido-Page] Post Encomenda';
}

export class PainelRapidoCreateEncomenda {
    static readonly type = '[Encomendas API] Created Encomenda';
    constructor(public encomenda: Encomenda) { }
}

export class PainelRapidoPatchEncomenda {
    static readonly type = '[Encomendas API] Patched Encomenda';
    constructor(public encomenda: Encomenda) { }
}
/* ###### */

/* Actions for orcamentos & pedidosContactoCliente*/
export class PainelRapidoFindAssistencias {
    static readonly type = '[Assistencias API] Find Assistencias';
}

export class PainelRapidoPostAssistencia {
    static readonly type = '[Painel-Rapido-Page] Post Assistencia';
}

export class PainelRapidoPatchAssistencia {
    static readonly type = '[Assistencias API] Patched Assistencia';
    constructor(public assistencia: Assistencia) { }
}
/* ###### */

@State<PainelRapidoPageStateModel | null>({
    name: 'painelRapidoPage',
    defaults: null
})
export class PainelRapidoPageState {
    private static feathersService: FeathersService;

    constructor(injector: Injector) {
        PainelRapidoPageState.feathersService = injector.get<FeathersService>(FeathersService);
    }

    @Action(PainelRapidoFindAssistencias)
    findEncomendas({ getState, setState, dispatch }: StateContext<PainelRapidoPageStateModel>) {

    }

    @Action(PainelRapidoPostEncomenda)
    postEncomenda({ setState }: StateContext<PainelRapidoPageStateModel>, action: PainelRapidoPostEncomenda) {

    }

    @Action(PainelRapidoCreateEncomenda)
    createEncomenda({ setState }: StateContext<PainelRapidoPageStateModel>, action: PainelRapidoCreateEncomenda) {

    }

    @Action(PainelRapidoPatchEncomenda)
    patchEncomenda({ setState }: StateContext<PainelRapidoPageStateModel>, action: PainelRapidoPatchEncomenda) {

    }

    @Action(PainelRapidoFindAssistencias)
    findAssistencias({ getState, setState, dispatch }: StateContext<PainelRapidoPageStateModel>) {

    }

    @Action(PainelRapidoPostAssistencia)
    postAssistencia({ setState }: StateContext<PainelRapidoPageStateModel>, action: PainelRapidoPostAssistencia) {

    }

    @Action(PainelRapidoPatchAssistencia)
    patchAssistencia({ setState }: StateContext<PainelRapidoPageStateModel>, action: PainelRapidoPatchAssistencia) {

    }

}
