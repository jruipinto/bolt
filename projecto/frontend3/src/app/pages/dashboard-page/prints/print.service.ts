import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';
import { AssistenciaEntradaPrint } from 'src/app/pages/dashboard-page/prints/assistencia-entrada-print/assistencia-entrada-print.model';
import { AssistenciaSaidaPrint } from 'src/app/pages/dashboard-page/prints/assistencia-saida-print/assistencia-saida-print.model';
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
    const updatedAt = new Date().toLocaleDateString();
    // const updatedAt = assistencia.updatedAt.toLocaleDateString();
    //console.log({ ...assistencia, updatedAt });    
    
    this.assistenciaSaidaPrintSource.next(null);
    this.assistenciaEntradaPrintSource.next({ ...assistencia, updatedAt });
    this.print();
  }

  printAssistenciaSaida(data: Assistencia) {
    const print = this.print;
    const updatedAt = new Date().toLocaleDateString();
    const modData = { ...data, updatedAt };
    this.assistenciaEntradaPrintSource.next(null);
    this.assistenciaSaidaPrintSource.next(modData);

    print();
  }

}
