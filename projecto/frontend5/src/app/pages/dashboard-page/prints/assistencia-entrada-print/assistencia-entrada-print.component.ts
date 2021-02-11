import { Component, OnInit } from '@angular/core';
import { PrintService } from 'src/app/pages/dashboard-page/prints/print.service';

@Component({
  selector: 'app-assistencia-entrada-print',
  templateUrl: './assistencia-entrada-print.component.html',
  styleUrls: ['../assistencia-common-print-styles.scss'],
})
export class AssistenciaEntradaPrintComponent implements OnInit {
  constructor(private printService: PrintService) {}

  public printData$ = this.printService.currentAssistenciaEntradaPrint$;

  ngOnInit() {}
}
