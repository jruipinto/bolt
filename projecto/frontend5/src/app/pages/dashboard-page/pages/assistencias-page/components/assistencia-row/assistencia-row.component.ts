import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Assistencia } from 'src/app/shared';
import { AssistenciaRowService } from './assistencia-row.service';

@Component({
  selector: 'app-assistencia-row',
  templateUrl: './assistencia-row.component.html',
  styleUrls: ['./assistencia-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AssistenciaRowService],
})
export class AssistenciaRowComponent implements OnInit {
  @Input() assistencia: Assistencia;
  @Output() runAssistencia = new EventEmitter<number>();
  @Output() openAssistencia = new EventEmitter<number>();
  @Output() assignAssistencia = new EventEmitter<number>();
  @ViewChild('collapsedView') collapsedViewEl: ElementRef;
  @ViewChild('expandedView') expandedViewEl: ElementRef;
  @ViewChild('buttonsContainer') buttonsContainerEl: ElementRef;

  isExpanded = this.componentSVC.isComponentExpanded;

  constructor(private componentSVC: AssistenciaRowService) {}

  ngOnInit(): void {}

  toogleView(): void {
    this.componentSVC.toogleView({
      buttonsContainerEl: this.buttonsContainerEl,
      collapsedViewEl: this.collapsedViewEl,
      expandedViewEl: this.expandedViewEl,
    });
  }
}
