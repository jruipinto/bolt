import { Injector } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { append, patch, updateItem } from '@ngxs/store/operators';
import { FeathersService } from 'src/app/shared/services';
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
    private static feathersService: FeathersService;

    constructor(injector: Injector) {
        AssistenciasPageState.feathersService = injector.get<FeathersService>(FeathersService);
    }

    @Action( AssistenciasPageFindAssistencias )
    AssistenciasPageFindAssistencias({ getState, setState, dispatch }: StateContext<AssistenciasPageStateModel>) {
        AssistenciasPageState.feathersService
            .service('assistencias')
            .find({ query: { $limit: 25 } })
            .then(
                u => {
                    setState({ assistencias: u.data });
                    getState().assistencias.forEach((assistencia, index) => { // preenche o nome de cliente em cada assistencia do State
                        AssistenciasPageState.feathersService
                            .service('users')
                            .get(assistencia.cliente_user_id)
                            .then(
                                apiUser => {
                                    Object.assign(assistencia, { cliente_user_name: apiUser.nome });
                                    setState(
                                        patch({
                                            assistencias: updateItem(
                                                stateAssistencia => stateAssistencia.id === assistencia.id, assistencia
                                            )
                                        })
                                    );
                                },
                                err => console.log('error:', err)
                            )
                            ;
                    });
                },
                err => console.log('error:', err)
            )
            ;
        AssistenciasPageState.feathersService
            .service('assistencias')
            .on('created', apiAssistencia => { dispatch(new AssistenciasPageCreateAssistencia(apiAssistencia)); })
            ;
        AssistenciasPageState.feathersService
            .service('assistencias')
            .on('patched', apiAssistencia => { dispatch(new AssistenciasPagePatchAssistencia(apiAssistencia)); })
            ;
    }

    @Action( AssistenciasPageCreateAssistencia )
    AssistenciasPagecreateAssistencia({ setState }: StateContext<AssistenciasPageStateModel>, action: AssistenciasPageCreateAssistencia) {
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

    @Action( AssistenciasPagePatchAssistencia )
    AssistenciasPagepatchAssistencia({ setState }: StateContext<AssistenciasPageStateModel>, action: AssistenciasPagePatchAssistencia) {
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
