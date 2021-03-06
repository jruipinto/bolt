/* angular modules */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localePT from '@angular/common/locales/pt';
/* third party modules */
import { ClarityModule } from '@clr/angular';
/* routing & custom modules */
import { AppRoutingModule } from './app-routing.module';
import { AutofocusModule, FormStateModule } from './shared';
/* components */
import { AppComponent } from './app.component';
import { LoginPageComponent, SignupPageComponent } from './pages';
import { RLoadingComponent, RLoadingFullscreenComponent, ROfflineComponent } from './shared';

// the second parameter 'pt' is optional
registerLocaleData(localePT, 'pt');


@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    SignupPageComponent,
    RLoadingComponent,
    RLoadingFullscreenComponent,
    ROfflineComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ClarityModule,
    FormStateModule,
    AutofocusModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'pt' } ],
  bootstrap: [AppComponent]
})
export class AppModule { }
