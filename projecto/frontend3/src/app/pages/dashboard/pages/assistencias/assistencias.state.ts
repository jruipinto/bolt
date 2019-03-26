import { Injector } from '@angular/core';
import { State, StateContext, NgxsOnInit } from '@ngxs/store';
import { patch, append, updateItem } from '@ngxs/store/operators';
import { Receiver } from '@ngxs-labs/emitter';
import { FeathersService } from 'src/app/shared/services';
import { Assistencia } from 'src/app/shared/models';

export interface AssistenciaStateModel {
    assistencias: Assistencia[];
}
/* Actions */
export class PullAssistencias {
    static readonly type = '[Assistencias] Pull from api';
}

export class CreateAssistencias {
    static readonly type = '[Assistencias] received created from api';
    constructor(public assistencia: Assistencia) { }
}

export class PatchAssistencias {
    static readonly type = '[Assistencias] received patched from api';
    constructor(public assistencia: Assistencia) { }
}
/* ###### */
@State<AssistenciaStateModel | null>({
    name: 'assistenciasPage',
    defaults: null
})
export class AssistenciasState implements NgxsOnInit {
    private static feathersService: FeathersService;

    constructor(injector: Injector) {
        AssistenciasState.feathersService = injector.get<FeathersService>(FeathersService);
    }

    @Receiver({ action: PullAssistencias })
    public static pullAssistencias({ getState, setState }: StateContext<AssistenciaStateModel>) {
        AssistenciasState.feathersService
            .service('assistencias')
            .find({ query: { $limit: 25 } })
            .then(
                u => {
                    setState({ assistencias: u.data });
                    getState().assistencias.forEach((assistencia, index) => { // preenche o nome de cliente em cada assistencia do State
                        AssistenciasState.feathersService
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
    }

    @Receiver({ action: [PatchAssistencias] })
    public static patchAssistencias({ setState }: StateContext<AssistenciaStateModel>, action: PatchAssistencias) {
        AssistenciasState.feathersService
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

    @Receiver({ action: [CreateAssistencias] })
    public static createAssistencias({ setState }: StateContext<AssistenciaStateModel>, action: CreateAssistencias) {
        AssistenciasState.feathersService
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

    ngxsOnInit({ dispatch }: StateContext<AssistenciaStateModel>) {
        dispatch(new PullAssistencias());
        AssistenciasState.feathersService
            .service('assistencias')
            .on('created', apiAssistencia => { dispatch(new CreateAssistencias(apiAssistencia)); })
            ;
        AssistenciasState.feathersService
            .service('assistencias')
            .on('patched', apiAssistencia => { dispatch(new PatchAssistencias(apiAssistencia)); })
            ;
    }

}
