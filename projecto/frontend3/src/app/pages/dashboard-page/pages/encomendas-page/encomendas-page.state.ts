import { Injector } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { append, patch, updateItem } from '@ngxs/store/operators';
import { EncomendasApiService } from 'src/app/shared/services';
import { Encomenda } from 'src/app/shared/models';
import { tap} from 'rxjs/operators';

export interface EncomendasPageStateModel {
    encomendas: Encomenda[];
}
/* Actions */
export class EncomendasPageFindEncomendas {
    static readonly type = '[Encomendas API] Find Encomendas (EncomendasPageState)';
}

export class EncomendasPageCreateEncomenda {
    static readonly type = '[Encomendas API] Created Encomenda (EncomendasPageState)';
    constructor(public encomenda: Encomenda) { }
}

export class EncomendasPagePatchEncomenda {
    static readonly type = '[Encomendas API] Patched Encomenda (EncomendasPageState)';
    constructor(public encomenda: Encomenda) { }
}
/* ###### */
@State<EncomendasPageStateModel | null>({
    name: 'EncomendasPage',
    defaults: null
})
export class EncomendasPageState {
    private static encomendasApiService: EncomendasApiService;

    constructor(injector: Injector) {
        EncomendasPageState.encomendasApiService = injector.get<EncomendasApiService>(EncomendasApiService);
    }

    @Action(EncomendasPageFindEncomendas)
    findEncomendas({ setState, dispatch }: StateContext<EncomendasPageStateModel>) {
        const EncomendasAPI = EncomendasPageState.encomendasApiService;
        const encomendas$ = EncomendasAPI.find({ query: { $limit: 25 } });

        EncomendasAPI.onCreated()
            .subscribe(apiEncomenda => {
                dispatch(new EncomendasPageCreateEncomenda(apiEncomenda[0]));
            });
        EncomendasAPI.onPatched()
            .subscribe(apiEncomenda => {
                dispatch(new EncomendasPagePatchEncomenda(apiEncomenda[0]));
            });
        return encomendas$.pipe(
            tap(encomendas => setState({ encomendas }))
        );
    }

    @Action(EncomendasPageCreateEncomenda)
    createEncomenda({ setState }: StateContext<EncomendasPageStateModel>, action: EncomendasPageCreateEncomenda) {
        setState(
            patch({
                encomendas: append([action.encomenda])
            })
        );
    }

    @Action(EncomendasPagePatchEncomenda)
    patchEncomenda({ setState }: StateContext<EncomendasPageStateModel>, action: EncomendasPagePatchEncomenda) {
        setState(
            patch({
                encomendas: updateItem(stateEncomenda => stateEncomenda.id === action.encomenda.id, action.encomenda)
            })
        );
    }
}
