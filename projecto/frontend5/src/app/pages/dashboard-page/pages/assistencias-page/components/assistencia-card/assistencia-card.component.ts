import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Assistencia } from 'src/app/shared';

@Component({
  selector: 'app-assistencia-card',
  templateUrl: './assistencia-card.component.html',
  styleUrls: ['./assistencia-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssistenciaCardComponent implements OnInit {
  @Input() assistencia: Assistencia;
  @Output() runAssistencia = new EventEmitter<number>();
  @Output() openAssistencia = new EventEmitter<number>();
  @Output() assignAssistencia = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}
}
