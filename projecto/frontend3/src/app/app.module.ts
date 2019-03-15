/* angular modules */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
/* third party modules */
import { ClarityModule } from '@clr/angular';
/* routing & custom modules */
import { AppRoutingModule } from './app-routing.module';
import { NgxsStoreModule } from './app-store.module';
/* components */
import { AppComponent } from './app.component';
import { LoginPageComponent, SignupPageComponent } from './pages';


@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    SignupPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxsStoreModule,
    AppRoutingModule,
    ClarityModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
