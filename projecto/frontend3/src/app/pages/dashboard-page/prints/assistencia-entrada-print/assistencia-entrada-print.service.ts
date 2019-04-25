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
    const updatedAt = new Date().toLocaleDateString();
    const modData = {...data, updatedAt};
    this.printSource.next(modData);
    /*
    * window.print() block the UI thread of the application.
    * The application freezes and can't do anything.
    * This is how browsers work and Angular can't do anything about it.
    * This is why I'm waiting 150 milisecs to do window.print() after.
    */
    timer(150).subscribe(() => window.print());
  }
}
