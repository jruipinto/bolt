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
export class AssistenciaModalGetAssistencia {
    static readonly type = '[Assistencias API] Get Assistencia';
    constructor(public id: number) { }
}

export class AssistenciaModalPostAssistencia {
    static readonly type = '[Assistencia-Modal] Post Assistencia';
    constructor(public newEstado: string, public assistencia: Assistencia) { }
}

export class AssistenciaModalPatchAssistencia {
    static readonly type = '[Assistencias API] Patched Assistencia';
    constructor(public assistencia: Assistencia) { }
}

export class AssistenciaModalClose {
    static readonly type = '[Assistencia-Modal] Closed Modal';
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


    @Action( AssistenciaModalGetAssistencia )
    getAssistencia({ patchState, dispatch }: StateContext<AssistenciaModalStateModel>, action: AssistenciaModalGetAssistencia) {
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
            .on('patched', apiAssistencia => { dispatch(new AssistenciaModalPatchAssistencia(apiAssistencia)); })
            ;
    }

    @Action( AssistenciaModalPostAssistencia )
    postAssistencia(
        { patchState, getState, dispatch }: StateContext<AssistenciaModalStateModel>,
        action: AssistenciaModalPostAssistencia) {
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
                    dispatch(new AssistenciaModalClose());
                },
                err => console.log('error:', err)
            )
            ;
    }

    @Action( AssistenciaModalPatchAssistencia )
    patchAssistencia({ patchState, getState }: StateContext<AssistenciaModalStateModel>, action: AssistenciaModalPatchAssistencia) {
        if (action.assistencia.id = getState().assistencia.id) {
            patchState({ assistencia: action.assistencia });
        }
    }

    @Action( AssistenciaModalClose )
    unsetModalIsOpen({ patchState }: StateContext<AssistenciaModalStateModel>) {
        patchState({ modalIsOpen: false });
    }
}
