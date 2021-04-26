import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-technical-report',
  templateUrl: './technical-report.component.html',
  styleUrls: ['./technical-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalReportComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
