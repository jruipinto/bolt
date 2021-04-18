import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Assistencia } from 'src/app/shared';

@Component({
  selector: 'app-assistencia-row-list',
  templateUrl: './assistencia-row-list.component.html',
  styleUrls: ['./assistencia-row-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssistenciaRowListComponent {
  @Input() assistencias$: Observable<Assistencia[]>;
  @Input() isLoading = false;

  constructor() {}
}
