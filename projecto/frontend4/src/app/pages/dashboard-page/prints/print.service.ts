import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';
import { Assistencia } from 'src/app/shared';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  private assistenciaEntradaPrintSource = new BehaviorSubject<Assistencia>(null);
  public currentAssistenciaEntradaPrint$ = this.assistenciaEntradaPrintSource.asObservable();

  private assistenciaSaidaPrintSource = new BehaviorSubject<Assistencia>(null);
  public currentAssistenciaSaidaPrint$ = this.assistenciaSaidaPrintSource.asObservable();

  constructor() { }

  private print(): void {
    /*
    * window.print() block the UI thread of the application.
    * The application freezes and can't do anything.
    * This is how browsers work and Angular can't do anything about it.
    * This is why I'm waiting 150 milisecs to do window.print() after.
    */
    timer(150).subscribe(() => window.print());
  }

  printAssistenciaEntrada(assistencia: Assistencia) {
    const createdAt = assistencia.createdAt.slice(0, 10);

    this.assistenciaSaidaPrintSource.next(null);
    this.assistenciaEntradaPrintSource.next({ ...assistencia, createdAt });
    this.print();
  }

  printAssistenciaSaida(assistencia: Assistencia) {
    const updatedAt = assistencia.updatedAt.slice(0, 10);

    this.assistenciaEntradaPrintSource.next(null);
    this.assistenciaSaidaPrintSource.next({ ...assistencia, updatedAt });
    this.print();
  }

}
