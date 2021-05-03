import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
} from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Observable } from 'rxjs';
import { Encomenda } from 'src/app/shared';

@AutoUnsubscribe()
@Component({
  selector: 'app-encomenda-row-list',
  templateUrl: './encomenda-row-list.component.html',
  styleUrls: ['./encomenda-row-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EncomendaRowListComponent implements OnDestroy {
  @Input() encomendas$: Observable<Encomenda[]>;
  @Input() isLoading = false;

  constructor() {}

  ngOnDestroy(): void {}
}
