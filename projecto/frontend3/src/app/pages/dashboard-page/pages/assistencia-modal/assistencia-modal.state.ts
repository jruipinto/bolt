import { Injector } from '@angular/core'; // for static dependency injection (@ngxs specific)
import { Action, State, StateContext } from '@ngxs/store';
import { AuthService, AssistenciasApiService } from 'src/app/shared/services';
import { Assistencia } from 'src/app/shared/models';
import { first, takeWhile } from 'rxjs/operators';

export interface AssistenciaModalStateModel {
    modalIsOpen?: boolean; // modal visible or not
    assistencia: Partial<Assistencia>; // the assistencia object to fill the modal
}
/* Actions */
export class AssistenciaModalGetAssistencia {
    static readonly type = '[Assistencias API] Get Assistencia';
    constructor(public id: number) { }
}

export class AssistenciaModalPostAssistencia {
    static readonly type = '[Assistencia-Modal] Post Assistencia';
    constructor(public assistencia: Assistencia) { }
}

export class AssistenciaModalPatchAssistencia3 {
    static readonly type = '[Assistencias API] Patched Assistencia3';
    constructor(public assistencia: Assistencia) { }
}

export class AssistenciaModalPatchAssistencia2 {
    static readonly type = '[Assistencias API] Patched Assistencia (get asked this)';
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
    private static assistenciasApiService: AssistenciasApiService;

    constructor(injector: Injector) {
        AssistenciaModalState.authService = injector.get<AuthService>(AuthService);
        AssistenciaModalState.assistenciasApiService = injector.get<AssistenciasApiService>(AssistenciasApiService);
    }


    @Action(AssistenciaModalGetAssistencia)
    getAssistencia({ getState, patchState, dispatch }: StateContext<AssistenciaModalStateModel>, action: AssistenciaModalGetAssistencia) {
        const assistenciasAPI = AssistenciaModalState.assistenciasApiService;
        const assistencia$ = AssistenciaModalState.assistenciasApiService.get(action.id);
        assistencia$.pipe(first()).subscribe(
            apiAssistencia => { patchState({ modalIsOpen: true, assistencia: apiAssistencia[0] }); },
            err => console.log('error:', err)
        )
            ;
        // assistenciasAPI.on('patched', apiAssistencia => { dispatch(new AssistenciaModalPatchAssistencia(apiAssistencia)); });
        assistenciasAPI.onPatched()
            .pipe(
                takeWhile(() => getState().modalIsOpen)
            )
            .subscribe(patchedAssistencia => {
                const assistencia: any = { ...patchedAssistencia };
                console.log('i dispatched patch =', getState().modalIsOpen);
                if (getState().modalIsOpen) { dispatch(new AssistenciaModalPatchAssistencia2(assistencia)); }
            });
    }

    @Action(AssistenciaModalPostAssistencia)
    postAssistencia(
        { patchState, getState, dispatch }: StateContext<AssistenciaModalStateModel>,
        action: AssistenciaModalPostAssistencia) {
        const assistenciasAPI = AssistenciaModalState.assistenciasApiService;
        // parse json to add new timestamp to it
        let parsed_tecnico_user_id: any = JSON.parse(action.assistencia.tecnico_user_id);
        if (typeof parsed_tecnico_user_id === 'string') {
            parsed_tecnico_user_id = JSON.parse(parsed_tecnico_user_id);
        }
        parsed_tecnico_user_id.push(
            {
                tecnico_user_id: AssistenciaModalState.authService.getUserId(),
                estado: action.assistencia.estado,
                updatedAt: new Date().toLocaleString() // dia/mes/ano, hora:minuto:segundo naquele momento
            }
        );

        // self explanatory ( patchState() )
        const stateAssistencia = getState().assistencia;
        const newPropsToAssistencia = {
            estado: action.assistencia.estado,
            relatorio_interno: action.assistencia.relatorio_interno,
            relatorio_cliente: action.assistencia.relatorio_cliente,
            preco: action.assistencia.preco,
            tecnico_user_id: JSON.stringify(parsed_tecnico_user_id)
        };
        const newStateAssistencia: Partial<Assistencia> = { ...stateAssistencia, ...newPropsToAssistencia };

        patchState({ assistencia: newStateAssistencia });

        console.log('modal:', getState().modalIsOpen);

        // submit state to database
        dispatch(new AssistenciaModalClose()).subscribe(() =>
            assistenciasAPI.patch(getState().assistencia.id, getState().assistencia)
                .pipe(first())
                .subscribe(
                    () => {
                        console.log('Pushed to api with success');
                    },
                    err => console.log('error:', err)
                )
        );
    }

    @Action([AssistenciaModalPatchAssistencia3, AssistenciaModalPatchAssistencia2])
    patchAssistencia({ patchState, getState }: StateContext<AssistenciaModalStateModel>,
        action: AssistenciaModalPatchAssistencia3|AssistenciaModalPatchAssistencia2) {
        console.log('modal:', getState().modalIsOpen);
        if (action.assistencia.id = getState().assistencia.id) {
            patchState({ assistencia: action.assistencia });
        }
    }

    @Action(AssistenciaModalClose)
    unsetModalIsOpen({ getState, patchState }: StateContext<AssistenciaModalStateModel>) {
        patchState({ modalIsOpen: false });
        console.log('modal:', getState().modalIsOpen);
    }
}
