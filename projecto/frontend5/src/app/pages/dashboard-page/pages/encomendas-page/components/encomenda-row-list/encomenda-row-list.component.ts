import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Encomenda } from 'src/app/shared';

@Component({
  selector: 'app-encomenda-row-list',
  templateUrl: './encomenda-row-list.component.html',
  styleUrls: ['./encomenda-row-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EncomendaRowListComponent {
  @Input() encomendas$: Observable<Encomenda[]>;
  @Input() isLoading = false;

  constructor() {}
}
