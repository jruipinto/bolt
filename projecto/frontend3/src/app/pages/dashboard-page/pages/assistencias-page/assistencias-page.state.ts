import { Injector } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { append, patch, updateItem } from '@ngxs/store/operators';
import { AssistenciasApiService } from 'src/app/shared/services';
import { Assistencia } from 'src/app/shared/models';

export interface AssistenciasPageStateModel {
    assistencias: Assistencia[];
}
/* Actions */
export class AssistenciasPageFindAssistencias {
    static readonly type = '[Assistencias API] Find Assistencias';
}

export class AssistenciasPageCreateAssistencia {
    static readonly type = '[Assistencias API] Created Assistencia';
    constructor(public assistencia: Assistencia) { }
}

export class AssistenciasPagePatchAssistencia {
    static readonly type = '[Assistencias API] Patched Assistencia';
    constructor(public assistencia: Assistencia) { }
}
/* ###### */
@State<AssistenciasPageStateModel | null>({
    name: 'assistenciasPage',
    defaults: null
})
export class AssistenciasPageState {
    private static assistenciasApiService: AssistenciasApiService;

    constructor(injector: Injector) {
        AssistenciasPageState.assistenciasApiService = injector.get<AssistenciasApiService>(AssistenciasApiService);
    }

    @Action(AssistenciasPageFindAssistencias)
    findAssistencias({ setState, dispatch }: StateContext<AssistenciasPageStateModel>) {
        const assistenciasAPI = AssistenciasPageState.assistenciasApiService;
        const assistencias$ = assistenciasAPI.find({ query: { $limit: 25 } });

        assistencias$.subscribe(assistencias => setState({ assistencias }));
        assistenciasAPI.on('created', apiAssistencia => { dispatch(new AssistenciasPageCreateAssistencia(apiAssistencia)); });
        assistenciasAPI.on('patched', apiAssistencia => { dispatch(new AssistenciasPagePatchAssistencia(apiAssistencia)); });
    }

    @Action(AssistenciasPageCreateAssistencia)
    createAssistencia({ setState }: StateContext<AssistenciasPageStateModel>, action: AssistenciasPageCreateAssistencia) {
        const assistencia$ = AssistenciasPageState.assistenciasApiService.get(action.assistencia.cliente_user_id);
        assistencia$.subscribe(
            assistencia => {
                setState(
                    patch({
                        assistencias: append([assistencia])
                    })
                );
            },
            err => console.log('error:', err)
        );
    }

    @Action(AssistenciasPagePatchAssistencia)
    patchAssistencia({ setState }: StateContext<AssistenciasPageStateModel>, action: AssistenciasPagePatchAssistencia) {
        const assistencia$ = AssistenciasPageState.assistenciasApiService.get(action.assistencia.cliente_user_id);
        assistencia$.subscribe(
            assistencia => {
                    setState(
                        patch({
                            assistencias: updateItem(stateAssistencia => stateAssistencia.id === assistencia.id, assistencia)
                        })
                    );
                },
                err => console.log('error:', err)
            )
            ;
    }
}
