/* angular modules */
import { NgModule } from '@angular/core';

/* ngxs modules */
import { NgxsModule } from '@ngxs/store';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';

/* state */
import { ArtigosState } from '../store/artigos.state';
import { AssistenciasState } from '../store/assistencias.state';
import { EncomendasState } from '../store/encomendas.state';
import { UsersState } from '../store/users.state';
import { CriarNovaState } from './criar-nova/criar-nova.component.state';


@NgModule({
    imports: [
        NgxsModule.forFeature([
            ArtigosState,
            AssistenciasState,
            EncomendasState,
            UsersState,
            CriarNovaState
        ]),
        NgxsFormPluginModule
    ],
    exports: [
        NgxsModule,
        NgxsFormPluginModule
    ]
})
export class NgxsDashboardStoreModule { }
