import {
  Component,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Artigo } from 'src/app/shared';

@Component({
  selector: 'app-artigo-row-list',
  templateUrl: './artigo-row-list.component.html',
  styleUrls: ['./artigo-row-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtigoRowListComponent {
  @Input() artigos$: Observable<Artigo[]>;
  @Input() isLoading = false;
  @Output('rowClick') rowClick = new EventEmitter<Artigo>();

  constructor() {}
}
