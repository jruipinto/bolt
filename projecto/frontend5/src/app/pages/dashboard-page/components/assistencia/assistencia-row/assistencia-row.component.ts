import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { Assistencia } from 'src/app/shared';
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

  constructor(
    private componentSVC: AssistenciaRowService,
    private router: Router
  ) {}

  assignAssistencia(assistenciaID: number): void {}

  openAssistencia(assistenciaID: number) {
    return this.router.navigate(['/dashboard/assistencia', assistenciaID]);
  }

  runAssistencia(assistenciaID: number): void {}

  toogleView(): void {
    this.componentSVC.toogleView({
      buttonsContainerEl: this.buttonsContainerEl,
      collapsedViewEl: this.collapsedViewEl,
      expandedViewEl: this.expandedViewEl,
    });
  }
}
