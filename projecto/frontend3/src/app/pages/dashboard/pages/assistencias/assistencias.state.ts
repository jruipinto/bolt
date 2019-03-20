import { State, StateContext, NgxsOnInit } from '@ngxs/store';
import { Receiver } from '@ngxs-labs/emitter';
import { patch, updateItem } from '@ngxs/store/operators';
import { DataService } from 'src/app/shared';
import { Injector } from '@angular/core';
import { Assistencia } from 'src/app/shared/models';

export interface AssistenciaStateModel {
    assistencias: Assistencia[];
}
/* Actions */
export class InitAssistencias {
    static readonly type = '[Assistencias] init';
    constructor(public assistencias: Assistencia[]) { }
}

export class UpdateAssistencias {
    static readonly type = '[Assistencias] received update';
    constructor(public assistencias: Assistencia[]) { }
}
/* ###### */
@State<AssistenciaStateModel | null>({
    name: 'assistenciasPage',
    defaults: null
})
export class AssistenciasState implements NgxsOnInit {
    private static dataService: DataService;

    constructor(injector: Injector) {
        AssistenciasState.dataService = injector.get<DataService>(DataService);
    }

    @Receiver({ action: [InitAssistencias, UpdateAssistencias] })
    public static setValue({ setState }: StateContext<AssistenciaStateModel>, action: InitAssistencias | UpdateAssistencias) {
        const assistencias = action.assistencias;
        assistencias.forEach((assistencia, index) => { // preenche o nome de cliente em cada assistencia do array
            AssistenciasState.dataService.get$('users', assistencia.cliente_user_id)
                .subscribe(e => {
                    Object.assign(assistencias[index], { cliente_user_name: e.nome });
                });
        });
        if (action instanceof InitAssistencias) {
            setState({ assistencias: assistencias });
        } else if (action instanceof UpdateAssistencias) {
            setState(
                patch({
                    assistencias: updateItem(assistencia => assistencia.id === assistencias[0].id, assistencias[0])
                })
            );
        }
    }

    ngxsOnInit(ctx?: StateContext<AssistenciaStateModel>) {
        const assistencias$ = AssistenciasState.dataService.find$('assistencias', {
            query: {
                $limit: 25
            }
        });
        assistencias$.subscribe(u => {
            if (!ctx.getState()) {
                ctx.dispatch(new InitAssistencias(u.data));
            } else {
                ctx.dispatch(new UpdateAssistencias(u.data));
            }
        });

    }

}
