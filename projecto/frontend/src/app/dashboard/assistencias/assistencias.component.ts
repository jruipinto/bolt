import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-assistencias',
  templateUrl: './assistencias.component.html',
  styleUrls: ['./assistencias.component.scss']
})
export class AssistenciasComponent implements OnInit {
  public assistencias$: any[];
  private query: object;

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {
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
    // busca e ouve todas as assistencias criadas na DB e coloca no array
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



  /* ------------- funções dos botoes do modal --------------------*/

  guardar(
    relatorio_interno: string,
    relatorio_cliente: string,
    preco: number, assistenciaId: number,
    tecnico_user_id: string,
    listaIndex: number): void {

    let tecnico_JSON: JSON = JSON.parse(tecnico_user_id);

    const agora = new Date();

    // falta corrigir esta função

    Object.assign(tecnico_JSON, {
      tecnico_user_id: this.authService.getUserId(),
      estado: 'em análise',
      updatedAt: agora.toLocaleString()
    });

    tecnico_user_id = JSON.stringify(tecnico_JSON);


    this.query = {
      estado: 'em análise',
      relatorio_interno: relatorio_interno,
      relatorio_cliente: relatorio_cliente,
      preco: preco,
      tecnico_user_id: tecnico_user_id
    };

    this.dataService.patch$('assistencias', this.query, assistenciaId);

    this.toogleModal(listaIndex);
  }

  orcamentar(relatorio_interno: string, relatorio_cliente: string, preco: number, assistenciaId: number, listaIndex: number): void {
    this.query = {
      estado: 'orçamento pendente',
      relatorio_interno: relatorio_interno,
      relatorio_cliente: relatorio_cliente,
      preco: preco
    };

    this.dataService.patch$('assistencias', this.query, assistenciaId);

    this.toogleModal(listaIndex);
  }

  contactar(relatorio_interno: string, relatorio_cliente: string, preco: number, assistenciaId: number, listaIndex: number): void {
    this.query = {
      estado: 'contacto pendente',
      relatorio_interno: relatorio_interno,
      relatorio_cliente: relatorio_cliente,
      preco: preco
    };

    this.dataService.patch$('assistencias', this.query, assistenciaId);

    this.toogleModal(listaIndex);
  }

  fechar(relatorio_interno: string, relatorio_cliente: string, preco: number, assistenciaId: number, listaIndex: number): void {
    this.query = {
      estado: 'concluído',
      relatorio_interno: relatorio_interno,
      relatorio_cliente: relatorio_cliente,
      preco: preco
    };

    this.dataService.patch$('assistencias', this.query, assistenciaId);

    this.toogleModal(listaIndex);
  }

}
