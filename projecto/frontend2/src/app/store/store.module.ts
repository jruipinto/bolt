import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsConfig } from '@ngxs/store/src/symbols';
import { NgxsDevtoolsOptions } from '@ngxs/devtools-plugin/src/symbols';
import { NgxsLoggerPluginOptions } from '@ngxs/logger-plugin/src/symbols';
import { NgxsEmitPluginModule } from '@ngxs-labs/emitter';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { environment } from '../../environments/environment';

export const OPTIONS_CONFIG: Partial<NgxsConfig> = {
    /**
     * Run in development mode. This will add additional debugging features:
     * - Object.freeze on the state and actions to guarantee immutability
     * todo: you need set production mode
     * import { environment } from '@env';
     * developmentMode: !environment.production
     */
    developmentMode: false
};

export const DEVTOOLS_REDUX_CONFIG: NgxsDevtoolsOptions = {
    /**
     * Whether the dev tools is enabled or note. Useful for setting during production.
     * todo: you need set production mode
     * import { environment } from '@env';
     * disabled: environment.production
     */
    disabled: environment.production
};

export const LOGGER_CONFIG: NgxsLoggerPluginOptions = {
    /**
     * Disable the logger. Useful for prod mode..
     * todo: you need set production mode
     * import { environment } from '@env';
     * disabled: environment.production
     */
    disabled: environment.production
};

@NgModule({
    imports: [
        CommonModule,
        NgxsModule.forRoot([], OPTIONS_CONFIG),
        NgxsReduxDevtoolsPluginModule.forRoot(DEVTOOLS_REDUX_CONFIG),
        NgxsLoggerPluginModule.forRoot(LOGGER_CONFIG),
        NgxsEmitPluginModule.forRoot(),
        NgxsFormPluginModule.forRoot()
    ],
    exports: [NgxsModule]
})
export class NgxsStoreModule {}
