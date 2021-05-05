import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { Assistencia, AuthService } from 'src/app/shared';
import { AssistenciasService } from 'src/app/shared/state';
import { AssistenciaRowService } from './assistencia-row.service';

@Component({
  selector: 'app-assistencia-row',
  templateUrl: './assistencia-row.component.html',
  styleUrls: ['./assistencia-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AssistenciaRowService],
})
export class AssistenciaRowComponent {
  @Input() assistencia: Assistencia;
  @ViewChild('collapsedView') collapsedViewEl: ElementRef;
  @ViewChild('expandedView') expandedViewEl: ElementRef;
  @ViewChild('buttonsContainer') buttonsContainerEl: ElementRef;

  isExpanded = this.componentSVC.isComponentExpanded;
  loggedInUserID = this.authService.getUserId();

  constructor(
    private componentSVC: AssistenciaRowService,
    private router: Router,
    private assistencias: AssistenciasService,
    private authService: AuthService
  ) {}

  assignAssistencia(assistencia: Assistencia): void {
    this.assistencias
      .patch(
        assistencia.id,
        {
          ...assistencia,
          tecnico_user_id: this.loggedInUserID,
        },
        'edição'
      )
      .subscribe();
  }

  openAssistencia({ id }: Assistencia): Promise<boolean> {
    return this.router.navigate(['/dashboard/assistencia', id]);
  }

  runAssistencia(assistencia: Assistencia): void {
    this.assistencias
      .patch(
        assistencia.id,
        {
          ...assistencia,
          estado: 'em análise',
        },
        'novo estado'
      )
      .subscribe();
  }

  toogleView(): void {
    this.componentSVC.toogleView({
      buttonsContainerEl: this.buttonsContainerEl,
      collapsedViewEl: this.collapsedViewEl,
      expandedViewEl: this.expandedViewEl,
    });
  }
}
