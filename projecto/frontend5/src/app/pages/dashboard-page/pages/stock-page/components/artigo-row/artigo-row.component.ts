import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Artigo } from 'src/app/shared';

@Component({
  selector: 'app-artigo-row',
  templateUrl: './artigo-row.component.html',
  styleUrls: ['./artigo-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtigoRowComponent {
  @Input() artigo: Artigo;

  constructor(private router: Router) {}

  openArtigo(artigoID: number) {
    return this.router.navigate(['/dashboard/artigo', artigoID]);
  }
}
