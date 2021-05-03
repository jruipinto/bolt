import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
} from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Observable } from 'rxjs';
import { Assistencia } from 'src/app/shared';

@AutoUnsubscribe()
@Component({
  selector: 'app-assistencia-row-list',
  templateUrl: './assistencia-row-list.component.html',
  styleUrls: ['./assistencia-row-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssistenciaRowListComponent implements OnDestroy {
  @Input() assistencias$: Observable<Assistencia[]>;
  @Input() isLoading = false;

  constructor() {}

  ngOnDestroy(): void {}
}
