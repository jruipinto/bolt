import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-assistencias',
  templateUrl: './assistencias.component.html',
  styleUrls: ['./assistencias.component.scss']
})
export class AssistenciasComponent implements OnInit {
  assistencias$: any[];
  query: object;

  constructor(private dataService: DataService) {
    this.query = {
      query: {
        $limit: 25
      }
    };
    this.dataService.find$('assistencias', this.query).subscribe(u => this.updateAssistencias(u));
  }

  ngOnInit() {
  }

  updateAssistencias(u: any): void {
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
  }

  toogleModal(listaIndex: number): void {
    if (this.assistencias$[listaIndex].expanded) {
      delete this.assistencias$[listaIndex].expanded;
      return;
    }

    Object.assign(this.assistencias$[listaIndex], { expanded: true });
  }

  getClientNameById(): void {
    this.assistencias$.forEach((assistencia, index) => {
      this.dataService.get$('users', assistencia.cliente_user_id)
        .subscribe(e => {
          // console.log(e);
          Object.assign(this.assistencias$[index], { cliente_user_name: e.nome });
          // console.log(this.assistencias$[index]);
        });
    });
  }

  guardar(relatorio_interno: string, relatorio_cliente: string, preco: number, assistenciaId: number, listaIndex: number): void {
    this.query = {
      relatorio_interno: relatorio_interno,
      relatorio_cliente: relatorio_cliente,
      preco: preco
    };

    this.dataService.patch$('assistencias', this.query, assistenciaId);

    this.toogleModal(listaIndex);
  }

  orcamentar(relatorio_interno: string, relatorio_cliente: string, preco: number, assistenciaId: number, listaIndex: number): void {
    this.query = {
      relatorio_interno: relatorio_interno,
      relatorio_cliente: relatorio_cliente,
      preco: preco
    };

    this.dataService.patch$('assistencias', this.query, assistenciaId);

    this.toogleModal(listaIndex);
  }

  contactar(relatorio_interno: string, relatorio_cliente: string, preco: number, assistenciaId: number, listaIndex: number): void {
    this.query = {
      relatorio_interno: relatorio_interno,
      relatorio_cliente: relatorio_cliente,
      preco: preco
    };

    this.dataService.patch$('assistencias', this.query, assistenciaId);

    this.toogleModal(listaIndex);
  }

  fechar(relatorio_interno: string, relatorio_cliente: string, preco: number, assistenciaId: number, listaIndex: number): void {
    this.query = {
      relatorio_interno: relatorio_interno,
      relatorio_cliente: relatorio_cliente,
      preco: preco
    };

    this.dataService.patch$('assistencias', this.query, assistenciaId);

    this.toogleModal(listaIndex);
  }

}
