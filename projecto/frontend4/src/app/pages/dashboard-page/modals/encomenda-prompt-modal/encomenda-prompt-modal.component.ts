import { Component, OnInit } from '@angular/core';
import { UIService, UI } from 'src/app/shared/state';
import { Router } from '@angular/router';
import { Artigo } from 'src/app/shared/models';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-encomenda-prompt-modal',
  templateUrl: './encomenda-prompt-modal.component.html',
  styleUrls: ['./encomenda-prompt-modal.component.scss']
})
export class EncomendaPromptModalComponent implements OnInit {
  public artigo$ = this.uiService.state$
    .pipe(
      map(
        (ui: UI) => ui.encomendaPromptModalArtigo
      )
    );
  public artigo: {} | Artigo;

  constructor(
    private uiService: UIService,
    private router: Router
  ) { }

  ngOnInit() {
    this.artigo$
      .subscribe(
        artigo => this.artigo = artigo
      );
  }

  orderArtigo(artigo: Artigo) {
    this.uiService.patchState({
      encomendaPageContactoClienteForm: { contacto: 918867376 },
      encomendaPageArtigoForm: artigo,
      encomendaPromptModalVisible: false,
      encomendaPromptModalArtigo: {}
    })
      .subscribe();
    return this.router.navigate(['/dashboard/encomendas-criar-nova']);
  }

  close() {
    this.uiService.patchState({
      encomendaPromptModalVisible: false,
      encomendaPromptModalArtigo: {}
    })
      .subscribe();
  }

}
