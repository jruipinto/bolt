import { Injector } from '@angular/core'; // for static dependency injection (@ngxs specific)
import { first, takeWhile, tap } from 'rxjs/operators';
import { Action, State, StateContext } from '@ngxs/store';
import { AuthService, ArtigosApiService } from 'src/app/shared/services';
import { Artigo } from 'src/app/shared/models';


export interface ArtigoCriarNovoModalStateModel {
    modalIsOpen?: boolean; // modal visible or not
    artigo: Partial<Artigo>; // the Artigo object to fill the modal
}
/* Actions */
export class ArtigoModalGetArtigo {
    static readonly type = '[Artigos API] Get Artigo (ArtigoCriarNovoModalState)';
    constructor(public id: number) { }
}

export class ArtigoModalPostArtigo {
    static readonly type = '[Artigo-Modal] Post Artigo (ArtigoCriarNovoModalState)';
    constructor(public artigo: Artigo) { }
}

export class ArtigoModalPatchArtigo {
    static readonly type = '[Artigos API] Patched Artigo (ArtigoCriarNovoModalState)';
    constructor(public artigo: Artigo) { }
}

export class ArtigoModalClose {
    static readonly type = '[Artigo-Modal] Closed Modal (ArtigoCriarNovoModalState)';
}
/* ###### */
@State<ArtigoCriarNovoModalStateModel | null>({
    name: 'ArtigoModal',
    defaults: null
})
export class ArtigoCriarNovoModalState {
    private static authService: AuthService;
    private static ArtigosApiService: ArtigosApiService;

    constructor(injector: Injector) {
        ArtigoCriarNovoModalState.authService = injector.get<AuthService>(AuthService);
        ArtigoCriarNovoModalState.ArtigosApiService = injector.get<ArtigosApiService>(ArtigosApiService);
    }


    @Action(ArtigoModalGetArtigo)
    getArtigo({ getState, patchState, dispatch }: StateContext<ArtigoCriarNovoModalStateModel>, action: ArtigoModalGetArtigo) {
        const ArtigosAPI = ArtigoCriarNovoModalState.ArtigosApiService;
        const Artigo$ = ArtigoCriarNovoModalState.ArtigosApiService.get(action.id);
        // ArtigosAPI.on('patched', apiArtigo => { dispatch(new ArtigoModalPatchArtigo(apiArtigo)); });
        ArtigosAPI.onPatched().pipe(
            takeWhile(() => getState().modalIsOpen),
            tap(patchedArtigo => {
                if (getState().modalIsOpen) {
                    dispatch(new ArtigoModalPatchArtigo(patchedArtigo[0]));
                }
            })
        ).subscribe();
        return Artigo$.pipe(
            tap(
                apiArtigo => patchState({ modalIsOpen: true, artigo: apiArtigo[0] })
            )
        );
    }

    @Action(ArtigoModalPostArtigo)
    postArtigo(
        { patchState, getState, dispatch }: StateContext<ArtigoCriarNovoModalStateModel>,
        action: ArtigoModalPostArtigo) {/*
        const ArtigosAPI = ArtigoCriarNovoModalState.ArtigosApiService;
        // parse json to add new timestamp to it
        let parsed_tecnico_user_id: any = JSON.parse(action.artigo.tecnico_user_id);
        if (typeof parsed_tecnico_user_id === 'string') {
            parsed_tecnico_user_id = JSON.parse(parsed_tecnico_user_id);
        }
        parsed_tecnico_user_id.push(
            {
                tecnico_user_id: ArtigoCriarNovoModalState.authService.getUserId(),
                estado: action.artigo.estado,
                updatedAt: new Date().toLocaleString() // dia/mes/ano, hora:minuto:segundo naquele momento
            }
        );

        // self explanatory ( patchState() )
        const stateArtigo = getState().artigo;
        const newPropsToArtigo = {
            estado: action.artigo.estado,
            relatorio_interno: action.artigo.relatorio_interno,
            relatorio_cliente: action.artigo.relatorio_cliente,
            preco: action.artigo.preco,
            tecnico_user_id: JSON.stringify(parsed_tecnico_user_id)
        };
        const newStateArtigo: Partial<Artigo> = { ...stateArtigo, ...newPropsToArtigo };

        patchState({ artigo: newStateArtigo });

        // submit state to database
        dispatch(new ArtigoModalClose()).subscribe(() =>
            ArtigosAPI.patch(getState().artigo.id, getState().artigo)
                .pipe(first())
                .subscribe(
                    () => {
                        console.log('Pushed to api with success');
                    },
                    err => console.log('error:', err)
                )
        );*/
    }

    @Action(ArtigoModalPatchArtigo)
    patchArtigo({ patchState, getState }: StateContext<ArtigoCriarNovoModalStateModel>,
        action: ArtigoModalPatchArtigo) {
        if (action.artigo.id = getState().artigo.id) {
            patchState({ artigo: action.artigo });
        }
    }

    @Action(ArtigoModalClose)
    unsetModalIsOpen({  patchState }: StateContext<ArtigoCriarNovoModalStateModel>) {
        patchState({ modalIsOpen: false });
    }
}
