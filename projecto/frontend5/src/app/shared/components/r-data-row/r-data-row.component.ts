import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'r-data-row',
  templateUrl: './r-data-row.component.html',
  styleUrls: ['./r-data-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RDataRowComponent {
  @Input() ariaExpanded: boolean;

  constructor() {}
}
