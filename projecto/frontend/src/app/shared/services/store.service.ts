import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  // declarations
  public assistencias$: any[];
  private query: {};

  constructor(private dataService: DataService) { }

  updateAssistencias(): void {
    // busca e ouve todas as assistencias criadas na DB e coloca no array
    this.query = {
      query: {
        $limit: 25
      }
    };
    this.dataService.find$('assistencias', this.query).subscribe(u => {
      if (!this.assistencias$) {
        this.assistencias$ = u.data;
      } else {
        this.assistencias$.forEach((assistencia, index) => {
          if (assistencia.id === u.data[0].id) {
            Object.assign(this.assistencias$[index], u.data[0]);
          }
        });
      }
      this.getClientNameById();
    });
  }

  toogleModal(listaIndex: number): void {
    // abre e fecha o modal
    if (this.assistencias$[listaIndex].expanded) {
      delete this.assistencias$[listaIndex].expanded;
      return;
    }

    Object.assign(this.assistencias$[listaIndex], { expanded: true });
  }

  getClientNameById(): void {
    // procura o nome do cliente que corresponde com a id de cliente na assistencia
    this.assistencias$.forEach((assistencia, index) => {
      this.dataService.get$('users', assistencia.cliente_user_id)
        .subscribe(e => {
          Object.assign(this.assistencias$[index], { cliente_user_name: e.nome });
        });
    });
  }

}
