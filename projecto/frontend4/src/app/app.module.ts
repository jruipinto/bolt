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
/* components */
import { AppComponent } from './app.component';
import { LoginPageComponent, SignupPageComponent } from './pages';
import { FormStateDirective } from './shared/directives/form-state.directive';


// the second parameter 'pt' is optional
registerLocaleData(localePT, 'pt');


@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    SignupPageComponent,
    FormStateDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ClarityModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'pt' } ],
  bootstrap: [AppComponent]
})
export class AppModule { }
