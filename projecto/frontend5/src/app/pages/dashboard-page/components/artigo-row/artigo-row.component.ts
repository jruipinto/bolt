import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Artigo } from 'src/app/shared';

@Component({
  selector: 'app-artigo-row',
  templateUrl: './artigo-row.component.html',
  styleUrls: ['./artigo-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtigoRowComponent {
  @Input() artigo: Artigo;
  @Output('rowClick') rowClick = new EventEmitter<Artigo>();

  constructor() {}
}
