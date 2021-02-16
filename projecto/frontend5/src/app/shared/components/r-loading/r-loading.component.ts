import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'r-loading',
  templateUrl: './r-loading.component.html',
  styleUrls: ['./r-loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RLoadingComponent {
  constructor() {}
}
