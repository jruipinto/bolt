import { Injector } from '@angular/core';
import { State, StateContext, Action } from '@ngxs/store';
import { Encomenda, Assistencia } from 'src/app/shared/models';
import { AssistenciasApiService } from 'src/app/shared/services';
import { EncomendasApiService } from 'src/app/shared/services/encomendas-api.service';
import { map } from 'rxjs/operators';

export interface PainelRapidoPageStateModel {
    encomendas?: Encomenda[];
    orcamentos?: Assistencia[];
    pedidosContactoCliente?: Assistencia[];
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

/* Actions for orcamentos */
export class PainelRapidoFindOrcamentos {
    static readonly type = '[Assistencias API] Find Assistencias';
}

export class PainelRapidoPostOrcamento {
    static readonly type = '[Painel-Rapido-Page] Post Assistencia';
}

export class PainelRapidoPatchOrcamento {
    static readonly type = '[Assistencias API] Patched Assistencia';
    constructor(public assistencia: Assistencia) { }
}

/* Actions for pedidosContactoCliente*/
export class PainelRapidoFindPedidosContactoCliente {
    static readonly type = '[Assistencias API] Find Assistencias';
}

export class PainelRapidoPostPedidosContactoCliente {
    static readonly type = '[Painel-Rapido-Page] Post Assistencia';
}

export class PainelRapidoPatchPedidosContactoCliente {
    static readonly type = '[Assistencias API] Patched Assistencia';
    constructor(public assistencia: Assistencia) { }
}
/* ###### */

@State<PainelRapidoPageStateModel | null>({
    name: 'painelRapidoPage',
    defaults: null
})
export class PainelRapidoPageState {
    private static encomendasApiService: EncomendasApiService;
    private static assistenciasApiService: AssistenciasApiService;

    constructor(injector: Injector) {
        PainelRapidoPageState.encomendasApiService = injector.get<EncomendasApiService>(EncomendasApiService);
        PainelRapidoPageState.assistenciasApiService = injector.get<AssistenciasApiService>(AssistenciasApiService);
    }

    @Action(PainelRapidoFindEncomendas)
    findEncomendas({ getState, patchState, setState, dispatch }: StateContext<PainelRapidoPageStateModel>) {
        const encomendas$ = PainelRapidoPageState.encomendasApiService.find();
        return encomendas$.pipe(
            map(encomendas => patchState({ encomendas }))
        );
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

    @Action(PainelRapidoFindOrcamentos)
    findOrcamentos({ getState, patchState, setState, dispatch }: StateContext<PainelRapidoPageStateModel>) {
        const orcamentos$ = PainelRapidoPageState.assistenciasApiService.find({ query: { estado: 'orçamento pendente' } });
        return orcamentos$.pipe(
            map(orcamentos => patchState({ orcamentos }))
        );
    }

    @Action(PainelRapidoPostOrcamento)
    postOrcamentos({ setState }: StateContext<PainelRapidoPageStateModel>, action: PainelRapidoPostOrcamento) {

    }

    @Action(PainelRapidoPatchOrcamento)
    patchOrcamentos({ setState }: StateContext<PainelRapidoPageStateModel>, action: PainelRapidoPatchOrcamento) {

    }

    @Action(PainelRapidoFindPedidosContactoCliente)
    findPedidosContactoCliente({ getState, patchState, setState, dispatch }: StateContext<PainelRapidoPageStateModel>) {
        const pedidosContactoCliente$ = PainelRapidoPageState.assistenciasApiService.find({ query: { estado: 'contacto pendente' } });
        return pedidosContactoCliente$.pipe(
            map(pedidosContactoCliente => patchState({ pedidosContactoCliente }))
        );
    }

    @Action(PainelRapidoPostPedidosContactoCliente)
    postPedidosContactoCliente({ setState }: StateContext<PainelRapidoPageStateModel>, action: PainelRapidoPostPedidosContactoCliente) {

    }

    @Action(PainelRapidoPatchPedidosContactoCliente)
    patchPedidosContactoCliente({ setState }: StateContext<PainelRapidoPageStateModel>, action: PainelRapidoPatchPedidosContactoCliente) {

    }

}
