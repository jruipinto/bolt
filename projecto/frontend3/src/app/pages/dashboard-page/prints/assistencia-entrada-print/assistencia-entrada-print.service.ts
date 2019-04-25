import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';
import { AssistenciaEntradaPrint } from './assistencia-entrada-print.model';

@Injectable({
  providedIn: 'root'
})
export class AssistenciaEntradaPrintService {
  private printSource = new BehaviorSubject<AssistenciaEntradaPrint>(null);
  public currentPrint$ = this.printSource.asObservable();

  constructor() { }

  print(data: AssistenciaEntradaPrint) {
    this.printSource.next(data);
    timer(150).subscribe(() => window.print());
  }
}
