/* angular modules */
import { NgModule } from '@angular/core';
/* ngxs modules */
import { NgxsModule } from '@ngxs/store';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
/* state */
import { AssistenciasState } from './pages/assistencias';
import { CriarNovaState } from './pages/criar-nova';


@NgModule({
    imports: [
        NgxsModule.forFeature([
            AssistenciasState,
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
