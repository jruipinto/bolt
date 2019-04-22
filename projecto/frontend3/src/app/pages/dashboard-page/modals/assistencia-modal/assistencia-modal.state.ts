import { Injector } from '@angular/core'; // for static dependency injection (@ngxs specific)
import { first, takeWhile, tap } from 'rxjs/operators';
import { Action, State, StateContext } from '@ngxs/store';
import { AuthService, AssistenciasApiService } from 'src/app/shared/services';
import { Assistencia } from 'src/app/shared/models';


export interface AssistenciaModalStateModel {
    modalIsOpen?: boolean; // modal visible or not
    assistencia: Partial<Assistencia>; // the assistencia object to fill the modal
}
/* Actions */
export class AssistenciaModalGetAssistencia {
    static readonly type = '[Assistencias API] Get Assistencia (AssistenciaModalState)';
    constructor(public id: number) { }
}

export class AssistenciaModalPostAssistencia {
    static readonly type = '[Assistencia-Modal] Post Assistencia (AssistenciaModalState)';
    constructor(public assistencia: Assistencia) { }
}

export class AssistenciaModalPatchAssistencia {
    static readonly type = '[Assistencias API] Patched Assistencia (AssistenciaModalState)';
    constructor(public assistencia: Assistencia) { }
}

export class AssistenciaModalClose {
    static readonly type = '[Assistencia-Modal] Closed Modal (AssistenciaModalState)';
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
        // assistenciasAPI.on('patched', apiAssistencia => { dispatch(new AssistenciaModalPatchAssistencia(apiAssistencia)); });
        assistenciasAPI.onPatched().pipe(
            takeWhile(() => getState().modalIsOpen),
            tap(patchedAssistencia => {
                if (getState().modalIsOpen) {
                    dispatch(new AssistenciaModalPatchAssistencia(patchedAssistencia[0]));
                }
            })
        ).subscribe();
        return assistencia$.pipe(
            tap(
                apiAssistencia => patchState({ modalIsOpen: true, assistencia: apiAssistencia[0] })
            )
        );
    }

    @Action(AssistenciaModalPostAssistencia)
    postAssistencia(
        { patchState, getState, dispatch }: StateContext<AssistenciaModalStateModel>,
        action: AssistenciaModalPostAssistencia) {
        const error = err => {
            console.log('Falhou a submissão. Chame o Admin.', err);
            alert('Falhou a submissão. Chame o Admin. (detalhes: CTRL + SHIFT + I)');
        };
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

        // submit state to database
        dispatch(new AssistenciaModalClose()).subscribe(() =>
            assistenciasAPI.patch(getState().assistencia.id, getState().assistencia)
                .subscribe(
                    () => {
                        console.log('Pushed to api with success');
                    },
                    error
                )
        );
    }

    @Action(AssistenciaModalPatchAssistencia)
    patchAssistencia({ patchState, getState }: StateContext<AssistenciaModalStateModel>,
        action: AssistenciaModalPatchAssistencia) {
        if (action.assistencia.id = getState().assistencia.id) {
            patchState({ assistencia: action.assistencia });
        }
    }

    @Action(AssistenciaModalClose)
    unsetModalIsOpen({ patchState }: StateContext<AssistenciaModalStateModel>) {
        patchState({ modalIsOpen: false });
    }
}
