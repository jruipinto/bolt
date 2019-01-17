import { State, StateContext, NgxsOnInit } from '@ngxs/store';
import { Receiver, EmitterAction } from '@ngxs-labs/emitter';
import { map } from 'rxjs/operators';
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

const defaults = [];

@State<any>({
    name: 'assistencias',
    defaults
})
export class AssistenciasState implements NgxsOnInit {

    constructor(private dataService: DataService) { }

    @Receiver()
    public static setValue(ctx: StateContext<any>, action: EmitterAction<any>) {
        ctx.setState({ value: action.payload });
    }

    ngxsOnInit(ctx?: StateContext<any>) {
        const assistencias$ = this.dataService.find$('assistencias', {
            query: {
                $limit: 25
            }
        })
            .pipe(
                map(u => {
                    ctx.setState(this.updateAssistencias(u, ctx.getState()));
                    ctx.setState(this.getClientNameById(ctx.getState()));
                })
            );
        assistencias$.subscribe(u => {
            console.log('state:', ctx.getState());
            // console.log(u);
            // ctx.setState(u);
        });

    }

    updateAssistencias(u: any, assistencias: any): object[] {
        // busca e ouve todas as assistencias criadas na DB e coloca no array
        if (!assistencias.length) {
            assistencias = u.data;
        } else {
            assistencias.forEach((assistencia, index) => {
                if (assistencia.id === u.data[0].id) {
                    Object.assign(assistencias[index], u.data[0]);
                }
            });
        }
        console.log('return:',Object.isExtensible(assistencias));
        // assistencias = this.getClientNameById(assistencias);
        return assistencias;
    }

    getClientNameById(assistencias: any): any {
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
