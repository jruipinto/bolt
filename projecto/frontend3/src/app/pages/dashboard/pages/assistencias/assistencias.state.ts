import { State, StateContext, NgxsOnInit } from '@ngxs/store';
import { Receiver } from '@ngxs-labs/emitter';
import { patch, updateItem } from '@ngxs/store/operators';
import { DataService, FeathersService } from 'src/app/shared';
import { Injector } from '@angular/core';
import { Assistencia } from 'src/app/shared/models';

export interface AssistenciaStateModel {
    assistencias: Assistencia[];
}
/* Actions */
export class PullAssistencias {
    static readonly type = '[Assistencias] Pull from api';
}

export class PatchAssistencias {
    static readonly type = '[Assistencias] received patch from api';
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

    @Receiver({ action: [PatchAssistencias] })
    public static setValue({ setState, getState }: StateContext<AssistenciaStateModel>, action: PatchAssistencias) {
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

    @Receiver({ action: PullAssistencias })
    public static setValue2({ getState, setState }: StateContext<AssistenciaStateModel>) {
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
                                            assistencias: updateItem(stateAssistencia => stateAssistencia.id === assistencia.id, assistencia)
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

    ngxsOnInit({ dispatch }: StateContext<AssistenciaStateModel>) {
        dispatch(new PullAssistencias());
        AssistenciasState.feathersService
            .service('assistencias')
            .on('created', assistencia => { dispatch(new PatchAssistencias(assistencia)); })
            ;
        AssistenciasState.feathersService
            .service('assistencias')
            .on('patched', assistencia => { console.log('patched: ', assistencia); })
            ;
    }

}
