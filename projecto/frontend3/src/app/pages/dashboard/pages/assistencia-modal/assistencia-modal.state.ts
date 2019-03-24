/* angular modules */
import { Injector } from '@angular/core'; // for static dependency injection (@ngxs specific)
/* @ngxs modules */
import { State, StateContext } from '@ngxs/store';
import { Receiver, EmitterAction } from '@ngxs-labs/emitter';
/* shared services */
import { DataService, AuthService } from 'src/app/shared/services';
/* shared models */
import { Assistencia } from 'src/app/shared/models';
import { Subscription } from 'rxjs';




export interface AssistenciaModalStateModel {
    modalIsOpen?: boolean; // modal visible or not
    newEstado?: string; // estado emitido pelo saveModal() do assistencia-modal.component
    assistencia: Partial<Assistencia>; // the assistencia object to fill the modal
}


/* Actions */
export class PullAssistencia {
    static readonly type = '[Assistencia-Modal] pull assistencia';
    constructor(public id: number) { }
}

export class UpdateAssistencia {
    static readonly type = '[Assistencia-Modal] received update';
    constructor(public assistencia: Assistencia) { }
}
/* ###### */


@State<AssistenciaModalStateModel | null>({
    name: 'assistenciaModal',
    defaults: null
})
export class AssistenciaModalState {
    private static dataService: DataService;
    private static authService: AuthService;
    private static updateSubscription: Subscription;

    constructor(injector: Injector) {
        AssistenciaModalState.dataService = injector.get<DataService>(DataService);
        AssistenciaModalState.authService = injector.get<AuthService>(AuthService);
    }


    @Receiver({ action: [PullAssistencia, UpdateAssistencia] })
    public static getValue(
        { patchState, dispatch }: StateContext<AssistenciaModalStateModel>,
        action: PullAssistencia | UpdateAssistencia) {
        if (action instanceof PullAssistencia) {
            this.updateSubscription = this.dataService.get$('assistencias', action.id)
                .subscribe(assistencia => {
                    dispatch(new UpdateAssistencia(assistencia));
                });
        } else {
            if (typeof action.assistencia === 'object') {
                patchState({ modalIsOpen: true, assistencia: action.assistencia });
                this.updateSubscription.unsubscribe();
            }
        }
    }

    @Receiver({ type: '[Assistencia-Modal] set value' })
    public static setValue(
        { patchState, getState, setState }: StateContext<AssistenciaModalStateModel>,
        { payload }: EmitterAction<AssistenciaModalStateModel>) {
        // parse json to add new timestamp to it
        let parsed_tecnico_user_id: any = JSON.parse(payload.assistencia.tecnico_user_id);
        if (typeof parsed_tecnico_user_id === 'string') {
            parsed_tecnico_user_id = JSON.parse(parsed_tecnico_user_id);
        }
        parsed_tecnico_user_id.push(
            {
                tecnico_user_id: this.authService.getUserId(),
                estado: payload.newEstado,
                updatedAt: new Date().toLocaleString() // dia/mes/ano, hora:minuto:segundo naquele momento
            }
        );

        // self explanatory ( patchState() )
        const assistencia = getState().assistencia;
        Object.assign(assistencia, {
            estado: payload.newEstado,
            relatorio_interno: payload.assistencia.relatorio_interno,
            relatorio_cliente: payload.assistencia.relatorio_cliente,
            preco: payload.assistencia.preco,
            tecnico_user_id: JSON.stringify(parsed_tecnico_user_id)
        });
        patchState({ modalIsOpen: false, assistencia: assistencia });

        // submit state to database
        const state = getState();
        this.dataService.patch$('assistencias', state.assistencia, state.assistencia.id);
    }

    @Receiver({ type: '[Assistencia-Modal] close without saving' })
    public static unsetModalIsOpen({ patchState }: StateContext<AssistenciaModalStateModel>) {
        patchState({ modalIsOpen: false });
    }
}
