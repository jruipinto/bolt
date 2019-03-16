import { State, StateContext } from '@ngxs/store';
import { Assistencia } from 'src/app/shared/models';
import { Receiver, EmitterAction } from '@ngxs-labs/emitter';

export interface AssistenciaModalStateModel {
    modalIsOpen: boolean;
    assistencia: Assistencia;
}


@State<AssistenciaModalStateModel|null>({
    name: 'assistenciaModal',
    defaults: null
})
export class AssistenciaModalState {

    constructor() {
    }

    @Receiver()
    public static setValue(ctx: StateContext<Assistencia>, action: EmitterAction<any>) {
        ctx.setState(action.payload);
    }

    @Receiver()
    public static setModalIsOpen({setState, getState}: StateContext<AssistenciaModalStateModel>, action: EmitterAction<number>): void {
        setState({modalIsOpen: true, assistencia: getState().assistencia});
    }

    @Receiver()
    public static unsetModalIsOpen({setState, getState}: StateContext<AssistenciaModalStateModel>, action: EmitterAction<number>): void {
        setState({modalIsOpen: false, assistencia: getState().assistencia});
    }

    @Receiver()
    public static toogleModal(ctx: StateContext<Assistencia>, action: EmitterAction<number>): void {
        // abre e fecha o modal
        const listaIndex: number = action.payload;
        const assistencias: AssistenciaStateModel[] = ctx.getState();
        if (assistencias[listaIndex].expanded) {
            delete assistencias[listaIndex].expanded;
            return;
        }
        Object.assign(assistencias[listaIndex], { expanded: true });
        ctx.setState(assistencias);
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

}