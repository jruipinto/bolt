import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Assistencia } from 'src/app/shared';

@Component({
  selector: 'app-assistencia-row',
  templateUrl: './assistencia-row.component.html',
  styleUrls: ['./assistencia-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssistenciaRowComponent implements OnInit {
  @Input() assistencia: Assistencia;
  @Output() runAssistencia = new EventEmitter<number>();
  @Output() openAssistencia = new EventEmitter<number>();
  @Output() assignAssistencia = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}
}
