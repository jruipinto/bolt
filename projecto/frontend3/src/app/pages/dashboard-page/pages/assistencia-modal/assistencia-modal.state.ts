import { Injector } from '@angular/core'; // for static dependency injection (@ngxs specific)
import { Action, State, StateContext } from '@ngxs/store';
import { AuthService, FeathersService } from 'src/app/shared/services';
import { Assistencia } from 'src/app/shared/models';

export interface AssistenciaModalStateModel {
    modalIsOpen?: boolean; // modal visible or not
    newEstado?: string; // estado emitido pelo saveModal() do assistencia-modal.component
    assistencia: Partial<Assistencia>; // the assistencia object to fill the modal
}
/* Actions */
export class PullAssistenciaModalState {
    static readonly type = '[Assistencia-Modal] Pulled from: assistencias api';
    constructor(public id: number) { }
}

export class PushAssistenciaModalState {
    static readonly type = '[Assistencia-Modal] Pushed to: assistencias api';
    constructor(public newEstado: string, public assistencia: Assistencia) { }
}

export class PatchAssistenciaModalState {
    static readonly type = '[Assistencia-Modal] received "patched" from: assistencias api';
    constructor(public assistencia: Assistencia) { }
}

export class CloseModalAssistencia {
    static readonly type = '[Assistencia-Modal] closed modal';
}
/* ###### */
@State<AssistenciaModalStateModel | null>({
    name: 'assistenciaModal',
    defaults: null
})
export class AssistenciaModalState {
    private static authService: AuthService;
    private static feathersService: FeathersService;

    constructor(injector: Injector) {
        AssistenciaModalState.authService = injector.get<AuthService>(AuthService);
        AssistenciaModalState.feathersService = injector.get<FeathersService>(FeathersService);
    }


    @Action( PullAssistenciaModalState )
    pullAssistenciaPage({ patchState, dispatch }: StateContext<AssistenciaModalStateModel>, action: PullAssistenciaModalState) {
        AssistenciaModalState.feathersService
            .service('assistencias')
            .get(action.id)
            .then(
                apiAssistencia => { patchState({ modalIsOpen: true, assistencia: apiAssistencia }); },
                err => console.log('error:', err)
            )
            ;
        AssistenciaModalState.feathersService
            .service('assistencias')
            .on('patched', apiAssistencia => { dispatch(new PatchAssistenciaModalState(apiAssistencia)); })
            ;
    }

    @Action( PushAssistenciaModalState )
    pushAssistenciaPage(
        { patchState, getState, dispatch }: StateContext<AssistenciaModalStateModel>,
        action: PushAssistenciaModalState) {
        // parse json to add new timestamp to it
        let parsed_tecnico_user_id: any = JSON.parse(action.assistencia.tecnico_user_id);
        if (typeof parsed_tecnico_user_id === 'string') {
            parsed_tecnico_user_id = JSON.parse(parsed_tecnico_user_id);
        }
        parsed_tecnico_user_id.push(
            {
                tecnico_user_id: AssistenciaModalState.authService.getUserId(),
                estado: action.newEstado,
                updatedAt: new Date().toLocaleString() // dia/mes/ano, hora:minuto:segundo naquele momento
            }
        );

        // self explanatory ( patchState() )
        const stateAssistencia = getState().assistencia;
        Object.assign(stateAssistencia, {
            estado: action.newEstado,
            relatorio_interno: action.assistencia.relatorio_interno,
            relatorio_cliente: action.assistencia.relatorio_cliente,
            preco: action.assistencia.preco,
            tecnico_user_id: JSON.stringify(parsed_tecnico_user_id)
        });
        patchState({ assistencia: stateAssistencia });

        // submit state to database
        AssistenciaModalState.feathersService
            .service('assistencias')
            .patch(getState().assistencia.id, getState().assistencia)
            .then(
                () => {
                    console.log('Pushed to api with success');
                    dispatch(new CloseModalAssistencia());
                },
                err => console.log('error:', err)
            )
            ;
    }

    @Action( PatchAssistenciaModalState )
    patchAssistenciaPage({ patchState, getState }: StateContext<AssistenciaModalStateModel>, action: PatchAssistenciaModalState) {
        if (action.assistencia.id = getState().assistencia.id) {
            patchState({ assistencia: action.assistencia });
        }
    }

    @Action( CloseModalAssistencia )
    unsetModalIsOpen({ patchState }: StateContext<AssistenciaModalStateModel>) {
        patchState({ modalIsOpen: false });
    }
}
