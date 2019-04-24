import { Component, OnInit } from '@angular/core';
import { AssistenciaEntradaPrintService } from './assistencia-entrada-print.service';

@Component({
  selector: 'app-assistencia-entrada-print',
  templateUrl: './assistencia-entrada-print.component.html',
  styleUrls: ['./assistencia-entrada-print.component.scss']
})
export class AssistenciaEntradaPrintComponent implements OnInit {

  constructor(private printService: AssistenciaEntradaPrintService) { }

  public printData$ = this.printService.currentPrint$

  ngOnInit() {
  }

}
