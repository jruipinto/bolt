import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'r-loading',
  templateUrl: './r-loading.component.html',
  styleUrls: ['./r-loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RLoadingComponent {
  @Input() loading: boolean;

  constructor() {}
}
