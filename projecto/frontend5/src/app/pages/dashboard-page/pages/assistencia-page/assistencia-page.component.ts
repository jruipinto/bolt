import { Component } from '@angular/core';
import { map } from 'rxjs/operators';

import { Assistencia } from 'src/app/shared/models';
import { AssistenciaPageService } from './assistencia-page.service';

@Component({
  selector: 'app-assistencia-page',
  templateUrl: './assistencia-page.component.html',
  styleUrls: ['./assistencia-page.component.scss'],
})
export class AssistenciaPageComponent {
  assistencia$ = this.pageSvc
    .observeState()
    .pipe(map((state) => state.assistenciaDraft));
  isLoading$ = this.pageSvc
    .observeState()
    .pipe(map((state) => state.isLoading));

  constructor(private pageSvc: AssistenciaPageService) {}
}
