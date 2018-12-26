import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { FeathersService } from './services/feathers.service';
import { DataService } from './services/data.service';
import { AutofocusDirective } from './directives/autofocus.directive';
import { StoreService } from './services/store.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    AutofocusDirective
  ],
  providers: [
    AuthGuard,
    AuthService,
    FeathersService,
    DataService,
    StoreService
  ]
})
export class SharedModule { }
