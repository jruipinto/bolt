import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
} from '@angular/core';
import { Assistencia } from 'src/app/shared';
import { TecnicoSelectModalComponent } from '../tecnico-select-modal/tecnico-select-modal.component';

@Component({
  selector: 'app-assistencia-info',
  templateUrl: './assistencia-info.component.html',
  styleUrls: ['./assistencia-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssistenciaInfoComponent {
  @ViewChild(TecnicoSelectModalComponent)
  tecnicoSelectModal: TecnicoSelectModalComponent;
  @Input() assistencia: Assistencia = null;

  constructor() {}
}
