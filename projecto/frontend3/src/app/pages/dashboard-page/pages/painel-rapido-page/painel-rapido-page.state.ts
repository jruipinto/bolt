import { Injector } from '@angular/core';
import { tap } from 'rxjs/operators';
import { State, StateContext, Action } from '@ngxs/store';
import { Encomenda, Assistencia } from 'src/app/shared/models';
import { AssistenciasApiService } from 'src/app/shared/services';
import { EncomendasApiService } from 'src/app/shared/services/encomendas-api.service';

export interface PainelRapidoPageStateModel {
    encomendas?: Encomenda[];
    orcamentos?: Assistencia[];
    pedidosContactoCliente?: Assistencia[];
}

/* Actions for encomendas */
export class PainelRapidoPageFindEncomendas {
    static readonly type = '[Encomendas API] Find Encomendas (Painel-Rapido-Page)';
}

export class PainelRapidoPagePostEncomenda {
    static readonly type = '[Painel-Rapido-Page] Post Encomenda (Painel-Rapido-Page)';
}

export class PainelRapidoPageCreateEncomenda {
    static readonly type = '[Encomendas API] Created Encomenda (Painel-Rapido-Page)';
    constructor(public encomenda: Encomenda) { }
}

export class PainelRapidoPagePatchEncomenda {
    static readonly type = '[Encomendas API] Patched Encomenda (Painel-Rapido-Page)';
    constructor(public encomenda: Encomenda) { }
}
/* ###### */

/* Actions for orcamentos */
export class PainelRapidoPageFindOrcamentos {
    static readonly type = '[Assistencias API] Find Assistencias (Painel-Rapido-Page)';
}

export class PainelRapidoPagePostOrcamento {
    static readonly type = '[Painel-Rapido-Page] Post Assistencia (Painel-Rapido-Page)';
}

export class PainelRapidoPagePatchOrcamento {
    static readonly type = '[Assistencias API] Patched Assistencia (Painel-Rapido-Page)';
    constructor(public assistencia: Assistencia) { }
}

/* Actions for pedidosContactoCliente*/
export class PainelRapidoPageFindPedidosContactoCliente {
    static readonly type = '[Assistencias API] Find Assistencias (Painel-Rapido-Page)';
}

export class PainelRapidoPagePostPedidoContactoCliente {
    static readonly type = '[Painel-Rapido-Page] Post Assistencia (Painel-Rapido-Page)';
}

export class PainelRapidoPagePatchPedidoContactoCliente {
    static readonly type = '[Assistencias API] Patched Assistencia (Painel-Rapido-Page)';
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

    @Action(PainelRapidoPageFindEncomendas)
    findEncomendas({ getState, patchState, setState, dispatch }: StateContext<PainelRapidoPageStateModel>) {
        const encomendasAPI = PainelRapidoPageState.encomendasApiService;
        const encomendas$ = encomendasAPI.find();

        encomendasAPI.onCreated()
        .subscribe(apiEncomenda => {
            dispatch(new PainelRapidoPageCreateEncomenda(apiEncomenda[0]));
        });
        encomendasAPI.onPatched()
            .subscribe(apiEncomenda => {
                dispatch(new PainelRapidoPagePatchEncomenda(apiEncomenda[0]));
            });
        return encomendas$.pipe(
            tap(encomendas => patchState({ encomendas }))
        );
    }

    @Action(PainelRapidoPagePostEncomenda)
    postEncomenda({ setState }: StateContext<PainelRapidoPageStateModel>, action: PainelRapidoPagePostEncomenda) {

    }

    @Action(PainelRapidoPageCreateEncomenda)
    createEncomenda({ setState }: StateContext<PainelRapidoPageStateModel>, action: PainelRapidoPageCreateEncomenda) {

    }

    @Action(PainelRapidoPagePatchEncomenda)
    patchEncomenda({ setState }: StateContext<PainelRapidoPageStateModel>, action: PainelRapidoPagePatchEncomenda) {

    }

    @Action(PainelRapidoPageFindOrcamentos)
    findOrcamentos({ getState, patchState, setState, dispatch }: StateContext<PainelRapidoPageStateModel>) {
        const assistenciasAPI = PainelRapidoPageState.assistenciasApiService;
        const orcamentos$ = assistenciasAPI.find({ query: { estado: 'orçamento pendente' } });

        assistenciasAPI.onPatched()
            .subscribe(apiAssistencia => {
                dispatch(new PainelRapidoPagePatchOrcamento(apiAssistencia[0]));
            });
        return orcamentos$.pipe(
            tap(orcamentos => patchState({ orcamentos }))
        );
    }

    @Action(PainelRapidoPagePostOrcamento)
    postOrcamentos({ setState }: StateContext<PainelRapidoPageStateModel>, action: PainelRapidoPagePostOrcamento) {

    }

    @Action(PainelRapidoPagePatchOrcamento)
    patchOrcamentos({ setState }: StateContext<PainelRapidoPageStateModel>, action: PainelRapidoPagePatchOrcamento) {

    }

    @Action(PainelRapidoPageFindPedidosContactoCliente)
    findPedidosContactoCliente({ getState, patchState, setState, dispatch }: StateContext<PainelRapidoPageStateModel>) {
        const assistenciasAPI = PainelRapidoPageState.assistenciasApiService;
        const pedidosContactoCliente$ = assistenciasAPI.find({ query: { estado: 'contacto pendente' } });

        assistenciasAPI.onPatched()
            .subscribe(apiAssistencia => {
                dispatch(new PainelRapidoPagePatchPedidoContactoCliente(apiAssistencia[0]));
            });
        return pedidosContactoCliente$.pipe(
            tap(pedidosContactoCliente => patchState({ pedidosContactoCliente }))
        );
    }

    @Action(PainelRapidoPagePostPedidoContactoCliente)
    postPedidosContactoCliente({ setState }: StateContext<PainelRapidoPageStateModel>, action: PainelRapidoPagePostPedidoContactoCliente) {

    }

    @Action(PainelRapidoPagePatchPedidoContactoCliente)
    patchPedidosContactoCliente({ setState }: StateContext<PainelRapidoPageStateModel>, action: PainelRapidoPagePatchPedidoContactoCliente) {

    }

}
