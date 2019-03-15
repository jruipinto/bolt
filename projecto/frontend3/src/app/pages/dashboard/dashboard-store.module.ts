/* angular modules */
import { NgModule } from '@angular/core';
/* ngxs modules */
import { NgxsModule } from '@ngxs/store';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
/* state */
import { AssistenciasState } from './pages/assistencias';
import { CriarNovaState } from './pages/criar-nova';
import { AssistenciaModalState } from './pages/assistencia-modal';


@NgModule({
    imports: [
        NgxsModule.forFeature([
            AssistenciasState,
            CriarNovaState,
            AssistenciaModalState
        ]),
        NgxsFormPluginModule
    ],
    exports: [
        NgxsModule,
        NgxsFormPluginModule
    ]
})
export class NgxsDashboardStoreModule { }
