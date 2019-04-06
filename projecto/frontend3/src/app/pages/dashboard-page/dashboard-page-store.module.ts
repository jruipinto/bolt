/* angular modules */
import { NgModule } from '@angular/core';
/* ngxs modules */
import { NgxsModule } from '@ngxs/store';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
/* state */
import { AssistenciasPageState } from './pages/assistencias-page';
import { AssistenciasCriarNovaPageState } from './pages/assistencias-criar-nova-page';
import { AssistenciaModalState } from './pages/assistencia-modal';
import { PainelRapidoPageState } from './pages';


@NgModule({
    imports: [
        NgxsModule.forFeature([
            AssistenciasPageState,
            AssistenciasCriarNovaPageState,
            AssistenciaModalState,
            PainelRapidoPageState
        ]),
        NgxsFormPluginModule
    ],
    exports: [
        NgxsModule,
        NgxsFormPluginModule
    ]
})
export class DashboardPageStoreModule { }
