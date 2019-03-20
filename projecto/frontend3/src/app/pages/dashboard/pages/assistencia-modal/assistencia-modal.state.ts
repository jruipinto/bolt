import { Injector } from '@angular/core'; // for static dependency injection (@ngxs specific)
import { State, StateContext } from '@ngxs/store';
import { Receiver, EmitterAction } from '@ngxs-labs/emitter';
import { DataService, AuthService } from 'src/app/shared/services';
import { Assistencia } from 'src/app/shared/models';
import { Observable } from 'rxjs';


export interface AssistenciaModalStateModel {
    modalIsOpen?: boolean; // modal visible or not
    newEstado?: string; // estado emitido pelo saveModal() do assistencia-modal.component
    assistencia: Partial<Assistencia>; // the assistencia object to fill the modal
}


@State<AssistenciaModalStateModel | null>({
    name: 'assistenciaModal',
    defaults: null
})
export class AssistenciaModalState {
    private static dataService: DataService;
    private static authService: AuthService;

    constructor(injector: Injector) {
        AssistenciaModalState.dataService = injector.get<DataService>(DataService);
        AssistenciaModalState.authService = injector.get<AuthService>(AuthService);
    }


    @Receiver({ type: '[Assistencia-Modal] get value' })
    public static getValue(
        { setState, patchState }: StateContext<AssistenciaModalStateModel>,
        { payload }: EmitterAction<number>): void {
        let state: AssistenciaModalStateModel;
        // const assistencia$: Observable<Assistencia> = this.dataService.get$('assistencias', payload);
        // this.dataService.get$('assistencias', payload).subscribe(assistencia => setState({ modalIsOpen: true, assistencia }));
        // this.dataService.get$('assistencias', payload).subscribe(assistencia => console.log(assistencia));
        // patchState({modalIsOpen: true});
        // return this.dataService.get$('assistencias', payload).subscribe(assistencia => patchState({ modalIsOpen: true, assistencia }));
        this.dataService.get$('assistencias', payload).subscribe(assistencia =>
            {
                state = assistencia;
                console.log(state);
            }
            );
		console.log('TCL: AssistenciaModalState -> state', state);
        
    }

    @Receiver({ type: '[Assistencia-Modal] set value' })
    public static setValue(
        { patchState, getState }: StateContext<AssistenciaModalStateModel>,
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
        // self explanatory
        patchState(
            {
                modalIsOpen: false,
                assistencia: {
                    estado: payload.newEstado,
                    relatorio_interno: payload.assistencia.relatorio_interno,
                    relatorio_cliente: payload.assistencia.relatorio_cliente,
                    preco: payload.assistencia.preco,
                    tecnico_user_id: JSON.stringify(parsed_tecnico_user_id)
                }
            }
        );
        // submit state to database
        const state = getState();
        this.dataService.patch$('assistencias', state.assistencia, state.assistencia.id);
    }

    @Receiver({ type: '[Assistencia-Modal] close without saving' })
    public static unsetModalIsOpen({ patchState }: StateContext<AssistenciaModalStateModel>): void {
        patchState({ modalIsOpen: false });
    }

    /*
        @Receiver()
        public static unsetModalIsOpen({ setState, getState }: StateContext<AssistenciaModalStateModel>): void {
            setState({ modalIsOpen: false, assistencia: getState().assistencia });
        }


        @Receiver()
        public static saveModal(ctx: StateContext<any>, action: EmitterAction<any>) {
            const estado: string = action.payload.estado;
            const relatorio_interno: string = action.payload.relatorio_interno;
            const relatorio_cliente: string = action.payload.relatorio_cliente;
            const preco: number = action.payload.preco;
            const assistencia_id: number = action.payload.assistencia_id;
            const tecnico_user_id: string = action.payload.tecnico_user_id;
            const lista_index: number = action.payload.lista_index;

            const agora = new Date();
            const alteracao: object = {
                tecnico_user_id: this.staticAuthService.getUserId(),
                estado: estado,
                updatedAt: agora.toLocaleString()
            };

            let parsed_tecnico_user_id: any = JSON.parse(tecnico_user_id);
            if (typeof parsed_tecnico_user_id === 'string') {
                parsed_tecnico_user_id = JSON.parse(parsed_tecnico_user_id);
            }
            parsed_tecnico_user_id.push(alteracao);

            const query = {
                estado: estado,
                relatorio_interno: relatorio_interno,
                relatorio_cliente: relatorio_cliente,
                preco: preco,
                tecnico_user_id: JSON.stringify(parsed_tecnico_user_id)
            };
            this.staticDataService.patch$('assistencias', query, assistencia_id);

            this.staticToogleModal.emit(lista_index);
        }

    */
}
