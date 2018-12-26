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

  save(
    estado: string,
    relatorio_interno: string,
    relatorio_cliente: string,
    preco: number, assistenciaId: number,
    tecnico_user_id: string,
    listaIndex: number
  ): void {

    const agora = new Date();
    const novoRegisto: object = {
      tecnico_user_id: this.authService.getUserId(),
      estado: estado,
      updatedAt: agora.toLocaleString()
    };
    const parsed_tecnico_user_id: object[] = JSON.parse(JSON.parse(tecnico_user_id));
    parsed_tecnico_user_id.push(novoRegisto);

    this.query = {
      estado: estado,
      relatorio_interno: relatorio_interno,
      relatorio_cliente: relatorio_cliente,
      preco: preco,
      tecnico_user_id: JSON.stringify(parsed_tecnico_user_id)
    };
    this.dataService.patch$('assistencias', this.query, assistenciaId);

    this.toogleModal(listaIndex);
  }

}
