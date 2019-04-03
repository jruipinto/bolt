import { Injector } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { append, patch, updateItem } from '@ngxs/store/operators';
import { FeathersService } from 'src/app/shared/services';
import { Assistencia } from 'src/app/shared/models';
import { from } from 'rxjs';
import { AssistenciasApiService } from 'src/app/shared/services/assistencias-api.service';

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
    private static feathersService: FeathersService;
    private static assistenciasAPI: AssistenciasApiService;

    constructor(injector: Injector) {
        AssistenciasPageState.feathersService = injector.get<FeathersService>(FeathersService);
        AssistenciasPageState.assistenciasAPI = injector.get<AssistenciasApiService>(AssistenciasApiService);
    }

    @Action(AssistenciasPageFindAssistencias)
    findAssistencias({ getState, setState, dispatch }: StateContext<AssistenciasPageStateModel>) {
        const assistenciasAPI = AssistenciasPageState.feathersService.service('assistencias');

        const assistencias$ = AssistenciasPageState.assistenciasAPI.find({ query: { $limit: 25 } });

        assistencias$.subscribe(assistencias => setState({ assistencias }));
        assistenciasAPI.on('created', apiAssistencia => { dispatch(new AssistenciasPageCreateAssistencia(apiAssistencia)); });
        assistenciasAPI.on('patched', apiAssistencia => { dispatch(new AssistenciasPagePatchAssistencia(apiAssistencia)); });
    }

    @Action(AssistenciasPageCreateAssistencia)
    createAssistencia({ setState }: StateContext<AssistenciasPageStateModel>, action: AssistenciasPageCreateAssistencia) {
        AssistenciasPageState.feathersService
            .service('users')
            .get(action.assistencia.cliente_user_id)
            .then(
                apiUser => {
                    Object.assign(action.assistencia, { cliente_user_name: apiUser.nome });
                    setState(
                        patch({
                            assistencias: append([action.assistencia])
                        })
                    );
                },
                err => console.log('error:', err)
            )
            ;
    }

    @Action(AssistenciasPagePatchAssistencia)
    patchAssistencia({ setState }: StateContext<AssistenciasPageStateModel>, action: AssistenciasPagePatchAssistencia) {
        AssistenciasPageState.feathersService
            .service('users')
            .get(action.assistencia.cliente_user_id)
            .then(
                apiUser => {
                    Object.assign(action.assistencia, { cliente_user_name: apiUser.nome });
                    setState(
                        patch({
                            assistencias: updateItem(stateAssistencia => stateAssistencia.id === action.assistencia.id, action.assistencia)
                        })
                    );
                },
                err => console.log('error:', err)
            )
            ;
    }
}
