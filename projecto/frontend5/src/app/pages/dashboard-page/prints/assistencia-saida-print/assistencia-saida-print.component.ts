import { Component, OnInit } from '@angular/core';
import { PrintService } from 'src/app/pages/dashboard-page/prints/print.service';

@Component({
  selector: 'app-assistencia-saida-print',
  templateUrl: './assistencia-saida-print.component.html',
  styleUrls: ['../assistencia-common-print-styles.scss'],
})
export class AssistenciaSaidaPrintComponent implements OnInit {
  constructor(private printService: PrintService) {}

  public printData$ = this.printService.currentAssistenciaSaidaPrint$;

  ngOnInit() {}
}
