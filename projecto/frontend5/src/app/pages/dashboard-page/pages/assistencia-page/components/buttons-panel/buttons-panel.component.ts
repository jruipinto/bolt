import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-buttons-panel',
  templateUrl: './buttons-panel.component.html',
  styleUrls: ['./buttons-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonsPanelComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
