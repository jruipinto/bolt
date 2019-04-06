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
    static readonly type = '[Assistencias API] Find Assistencias (AssistenciasPageState)';
}

export class AssistenciasPageCreateAssistencia {
    static readonly type = '[Assistencias API] Created Assistencia (AssistenciasPageState)';
    constructor(public assistencia: Assistencia) { }
}

export class AssistenciasPagePatchAssistencia {
    static readonly type = '[Assistencias API] Patched Assistencia (AssistenciasPageState)';
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

        assistenciasAPI.onCreated()
            .subscribe(apiAssistencia => {
                dispatch(new AssistenciasPageCreateAssistencia(apiAssistencia[0] as Assistencia));
            });
        assistenciasAPI.onPatched()
            .subscribe(apiAssistencia => {
                dispatch(new AssistenciasPagePatchAssistencia(apiAssistencia[0] as Assistencia));
            });
        return assistencias$.subscribe(assistencias => setState({ assistencias }));
    }

    @Action(AssistenciasPageCreateAssistencia)
    createAssistencia({ setState }: StateContext<AssistenciasPageStateModel>, action: AssistenciasPageCreateAssistencia) {
        setState(
            patch({
                assistencias: append([action.assistencia])
            })
        );
    }

    @Action(AssistenciasPagePatchAssistencia)
    patchAssistencia({ setState }: StateContext<AssistenciasPageStateModel>, action: AssistenciasPagePatchAssistencia) {
        setState(
            patch({
                assistencias: updateItem(stateAssistencia => stateAssistencia.id === action.assistencia.id, action.assistencia)
            })
        );
    }
}
