import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { map } from 'rxjs/operators';
import { Select } from '@ngxs/store';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { Observable } from 'rxjs';
import { AssistenciasState } from 'src/app/store/assistencias.state';

@Component({
  selector: 'app-assistencias',
  templateUrl: './assistencias.component.html',
  styleUrls: ['./assistencias.component.scss']
})
export class AssistenciasComponent implements OnInit {
  public assistencias = [];
  public assistencias$ = this.dataService.find$('assistencias', {
    query: {
      $limit: 25
    }
  })
  .pipe(
    map(u => this.updateAssistencias(u))
  );

  @Select(AssistenciasState)
  public assistenciasSTT$: Observable<any>;

  @Emitter(AssistenciasState.setValue)
  public assistenciasValue: Emittable<any>;

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {
    this.assistencias$.subscribe();
  }

  ngOnInit() {
  }

  updateAssistencias(u: any): void {
    console.log('u', Object.isExtensible(u.data[0]));
    // busca e ouve todas as assistencias criadas na DB e coloca no array
    if (!this.assistencias.length) {
      this.assistencias = u.data;
    } else {
      this.assistencias.forEach((assistencia, index) => {
        if (assistencia.id === u.data[0].id) {
          Object.assign(this.assistencias[index], u.data[0]);
        }
      });
    }
    console.log('b', Object.isExtensible(this.assistencias));
    this.getClientNameById();
  }

  toogleModal(listaIndex: number): void {
    // abre e fecha o modal
    if (this.assistencias[listaIndex].expanded) {
      delete this.assistencias[listaIndex].expanded;
      return;
    }

    Object.assign(this.assistencias[listaIndex], { expanded: true });
  }

  getClientNameById(): void {
    console.log('c', Object.isExtensible(this.assistencias));
    // procura o nome do cliente que corresponde com a id de cliente na assistencia
    this.assistencias.forEach((assistencia, index) => {
      console.log('cm', Object.isExtensible(assistencia));
      this.dataService.get$('users', assistencia.cliente_user_id)
        .subscribe(e => {
          console.log('cmp', Object.isExtensible(this.assistencias[index]));
          Object.assign(this.assistencias[index], { cliente_user_name: e.nome });
        });
    });
  }



  /* ------------- funções dos botoes do modal --------------------*/

  save(
    estado: string,
    relatorio_interno: string,
    relatorio_cliente: string,
    preco: number,
    assistenciaId: number,
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

    const query = {
      estado: estado,
      relatorio_interno: relatorio_interno,
      relatorio_cliente: relatorio_cliente,
      preco: preco,
      tecnico_user_id: JSON.stringify(parsed_tecnico_user_id)
    };
    this.dataService.patch$('assistencias', query, assistenciaId);

    this.toogleModal(listaIndex);
  }

}
