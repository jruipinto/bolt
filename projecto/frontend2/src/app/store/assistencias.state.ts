import { State, StateContext, NgxsOnInit } from '@ngxs/store';
import { Receiver, EmitterAction, Emitter, Emittable } from '@ngxs-labs/emitter';
import { DataService } from '../shared/services/data.service';
import { AuthService } from '../shared/services/auth.service';
import { Injector } from '@angular/core';

/*
export interface AssistenciasStateModel {
    value: number;
}

const defaults = null;

@State<AssistenciasStateModel>({
  name: 'assistencias',
  defaults
})
export class AssistenciasState {

    @Receiver()
    public static setValue(ctx: StateContext<AssistenciasStateModel>, action: EmitterAction<number>) {
        ctx.setState({ value: action.payload });
    }

}
*/
export interface AssistenciaStateModel {
    categoria: string;
    cliente_user_id: number;
    cliente_user_name: string;
    cor: string;
    createdAt: string;
    estado: string;
    id: number;
    marca: string;
    material: string;
    modelo: string;
    orcamento: number;
    preco: number;
    problema: string;
    relatorio_cliente: string;
    relatorio_interno: string;
    serial: string;
    tecnico_user_id: string;
    updatedAt: string;
    expanded?: boolean;
}

@State<AssistenciaStateModel[]>({
    name: 'assistencias'
})
export class AssistenciasState implements NgxsOnInit {
    // ######### declarations ############
    private static staticDataService: DataService;
    private static staticAuthService: AuthService;
    @Emitter(AssistenciasState.toogleModal) private static staticToogleModal: Emittable<number>;

    constructor(injector: Injector) {
        // the dependency injection with NGXSLabs Emitter is done like this because of the usage of static on @Receiver's
        // TodosState.api = injector.get<ApiService>(ApiService);
        AssistenciasState.staticDataService = injector.get<DataService>(DataService);
        AssistenciasState.staticAuthService = injector.get<AuthService>(AuthService);
    }


    /* ################################## @Receiver Funtions #############################################*/
    @Receiver()
    public static setValue(ctx: StateContext<AssistenciaStateModel[]>, action: EmitterAction<any>) {
        ctx.setState(action.payload);
    }

    @Receiver()
    public static toogleModal(ctx: StateContext<AssistenciaStateModel[]>, action: EmitterAction<number>): void {
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
        const parsed_tecnico_user_id: object[] = JSON.parse(JSON.parse(tecnico_user_id));
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




    /* #################################### AssistenciasState initialization ######################################### */
    // https://ngxs.gitbook.io/ngxs/advanced/life-cycle

    ngxsOnInit(ctx?: StateContext<AssistenciaStateModel[]>) {
        const assistencias$ = AssistenciasState.staticDataService.find$('assistencias', {
            query: {
                $limit: 25
            }
        });

        assistencias$.subscribe(u => {
            ctx.setState(this.updateAssistencias(u, ctx.getState()));
            console.log('state:', ctx.getState());
        });

    }

    updateAssistencias(u: any, assistencias: AssistenciaStateModel[]): AssistenciaStateModel[] {
        // busca e ouve todas as assistencias criadas na DB e coloca no array
        let updated = false;
        if (!assistencias.length) {
            assistencias = u.data;
        } else {
            assistencias.forEach((assistencia: AssistenciaStateModel, index: number) => {
                if (assistencia.id === u.data[0].id) {
                    Object.assign(assistencias[index], u.data[0]);
                    updated = true;
                }
            });
            if (!updated) { assistencias.push(...u.data); }
        }
        assistencias = this.addClientNameById(assistencias);
        return assistencias;
    }

    addClientNameById(assistencias: AssistenciaStateModel[]): AssistenciaStateModel[] {
        // procura o nome do cliente que corresponde com a id de cliente na assistencia
        assistencias.forEach((assistencia, index) => {
            AssistenciasState.staticDataService.get$('users', assistencia.cliente_user_id)
                .subscribe(e => {
                    Object.assign(assistencias[index], { cliente_user_name: e.nome });
                });
        });
        return assistencias;
    }

}
