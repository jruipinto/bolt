import { Component } from '@angular/core';

import { Assistencia } from 'src/app/shared/models';
import { AssistenciaPageService } from './assistencia-page.service';

@Component({
  selector: 'app-assistencia-page',
  templateUrl: './assistencia-page.component.html',
  styleUrls: ['./assistencia-page.component.scss'],
})
export class AssistenciaPageComponent {
  assistencia: Assistencia = this.pageSvc.assistenciaDraft;
  isLoading = this.pageSvc.isLoading;

  constructor(private pageSvc: AssistenciaPageService) {}
}
