import { State, StateContext, NgxsOnInit } from '@ngxs/store';
import { Receiver } from '@ngxs-labs/emitter';
import { patch, updateItem } from '@ngxs/store/operators';
import { DataService, FeathersService } from 'src/app/shared';
import { Injector } from '@angular/core';
import { Assistencia } from 'src/app/shared/models';
import { first } from 'rxjs/operators';

export interface AssistenciaStateModel {
    assistencias: Assistencia[];
}
/* Actions */
export class PullAssistencias {
    static readonly type = '[Assistencias] Pull from api';
    constructor(public assistencias: Assistencia[]) { }
}

export class PatchAssistencias {
    static readonly type = '[Assistencias] received patch';
    constructor(public assistencias: Assistencia[]) { }
}
/* ###### */
@State<AssistenciaStateModel | null>({
    name: 'assistenciasPage',
    defaults: null
})
export class AssistenciasState implements NgxsOnInit {
    private static dataService: DataService;
    private static feathersService: FeathersService;

    constructor(injector: Injector) {
        AssistenciasState.dataService = injector.get<DataService>(DataService);
        AssistenciasState.feathersService = injector.get<FeathersService>(FeathersService);
    }

    @Receiver({ action: [PullAssistencias, PatchAssistencias] })
    public static setValue({ setState }: StateContext<AssistenciaStateModel>, action: PullAssistencias | PatchAssistencias) {
        const assistencias = action.assistencias;
        assistencias.forEach((assistencia, index) => { // preenche o nome de cliente em cada assistencia do array
            AssistenciasState.dataService.get$('users', assistencia.cliente_user_id)
                .pipe(
                    first()
                )
                .subscribe(e => {
                    Object.assign(assistencias[index], { cliente_user_name: e.nome });
                });
        });
        if (action instanceof PullAssistencias) {
            setState({ assistencias: assistencias });
        } else if (action instanceof PatchAssistencias) {
            setState(
                patch({
                    assistencias: updateItem(assistencia => assistencia.id === assistencias[0].id, assistencias[0])
                })
            );
        }
    }

    ngxsOnInit({dispatch}: StateContext<AssistenciaStateModel>) {
        AssistenciasState.feathersService
            .service('assistencias')
            .find( {query: {$limit: 25} } )
            .then(
                u => { dispatch(new PullAssistencias(u.data)); },
                err => console.log('error:', err)
            )
        ;
        AssistenciasState.feathersService
            .service('assistencias')
            .on('created', assistencia => { console.log('created: ', assistencia); })
        ;
        AssistenciasState.feathersService
            .service('assistencias')
            .on('patched', assistencia => { console.log('patched: ', assistencia); })
        ;

    }

}
