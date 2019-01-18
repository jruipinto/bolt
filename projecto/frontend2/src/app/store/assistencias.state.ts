import { State, StateContext, NgxsOnInit } from '@ngxs/store';
import { Receiver, EmitterAction } from '@ngxs-labs/emitter';
import { DataService } from '../shared/services/data.service';

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

    constructor(private dataService: DataService) { }

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
    }

    ngxsOnInit(ctx?: StateContext<AssistenciaStateModel[]>) {
        const assistencias$ = this.dataService.find$('assistencias', {
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
        if (!assistencias.length) {
            assistencias = u.data;
        } else {
            assistencias.forEach((assistencia: AssistenciaStateModel, index: number) => {
                if (assistencia.id === u.data[0].id) {
                    Object.assign(assistencias[index], u.data[0]);
                }
            });
        }
        assistencias = this.addClientNameById(assistencias);
        return assistencias;
    }

    addClientNameById(assistencias: AssistenciaStateModel[]): AssistenciaStateModel[] {
        // procura o nome do cliente que corresponde com a id de cliente na assistencia
        assistencias.forEach((assistencia, index) => {
            this.dataService.get$('users', assistencia.cliente_user_id)
                .subscribe(e => {
                    Object.assign(assistencias[index], { cliente_user_name: e.nome });
                });
        });
        return assistencias;
    }

}

@State<any>({
    name: 'assistenciasModal'
})
export class AssistenciasModalState {
}
