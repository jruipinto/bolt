import { Injectable } from '@angular/core';
import { AssistenciasApiService, AuthService } from 'src/app/shared/services';
import { EntityStateAbstraction } from 'src/app/shared/abstraction-classes';
import { Assistencia, EventoCronologico, Artigo, Encomenda } from '../models';
import { map, concatMap, toArray, mergeMap } from 'rxjs/operators';
import { concat, of, merge } from 'rxjs';
import { ArtigosService } from './artigos.service';
import { EncomendasService } from './encomendas.service';

@Injectable({ providedIn: 'root' })
export class AssistenciasService extends EntityStateAbstraction {

  constructor(
    protected assistenciasAPI: AssistenciasApiService,
    private authService: AuthService,
    private artigosService: ArtigosService,
    private encomendasService: EncomendasService) {
    super(assistenciasAPI);
  }

  public get(id: number) {
    return super.get(id)
      .pipe(
        map((res: Assistencia[]) => res[0]),
        concatMap(
          assistencia => {
            if (assistencia.material) {
              return concat(assistencia.material
                .map(
                  (artigo: Partial<Artigo>) => this.artigosService.get(artigo.id)
                    .pipe(
                      map((dbArtigo: Artigo[]) => dbArtigo[0]),
                      map(dbArtigo => dbArtigo = { ...dbArtigo, qty: artigo.qty })
                    )
                ))
                .pipe(
                  concatMap(concats => concats),
                  toArray(),
                  map((material: Artigo[]) => ({ ...assistencia, material }) as Assistencia));
            }
            return of(assistencia);
          }
        ),
        concatMap(
          assistencia => {
            if (assistencia.encomendas) {
              return concat(assistencia.encomendas
                .map(
                  (encomenda: Partial<Encomenda>) => this.encomendasService.get(encomenda.id)
                    .pipe(
                      map((dbEncomenda: Encomenda[]) => dbEncomenda[0]),
                      map(dbEncomenda => dbEncomenda = { ...dbEncomenda, qty: encomenda.qty })
                    )
                ))
                .pipe(
                  concatMap(concats => concats),
                  toArray(),
                  map((encomendas: Encomenda[]) => ({ ...assistencia, encomendas }) as Assistencia));
            }
            return of(assistencia);
          }
        ),
        map(res => [res])
      );
  }

  public getAndWatch(id: number) {
    return super.getAndWatch(id)
      .pipe(
        map((res: Assistencia[]) => res[0]),
        mergeMap(
          assistencia => {
            if (assistencia.material) {
              return merge(assistencia.material
                .map(
                  (artigo: Partial<Artigo>) => this.artigosService.get(artigo.id)
                    .pipe(
                      map((dbArtigo: Artigo[]) => dbArtigo[0]),
                      map(dbArtigo => dbArtigo = { ...dbArtigo, qty: artigo.qty })
                    )
                ))
                .pipe(
                  mergeMap(merges => merges),
                  toArray(),
                  map((material: Artigo[]) => ({ ...assistencia, material }) as Assistencia));
            }
            return of(assistencia);
          }
        ),
        mergeMap(
          assistencia => {
            if (assistencia.encomendas) {
              return merge(assistencia.encomendas
                .map(
                  (encomenda: Partial<Encomenda>) => this.encomendasService.get(encomenda.id)
                    .pipe(
                      map((dbEncomenda: Encomenda[]) => dbEncomenda[0]),
                      map(dbEncomenda => dbEncomenda = { ...dbEncomenda, qty: encomenda.qty })
                    )
                ))
                .pipe(
                  mergeMap(merges => merges),
                  toArray(),
                  map((encomendas: Encomenda[]) => ({ ...assistencia, encomendas }) as Assistencia));
            }
            return of(assistencia);
          }
        ),
        map(res => [res])
      );
  }

  public create(assistencia: Partial<Assistencia>) {
    const registo_cronologico: EventoCronologico[] = [{
      tecnico_user_id: this.authService.getUserId(),
      estado: 'recebido',
      updatedAt: new Date().toLocaleString() // dia/mes/ano, hora:minuto:segundo naquele momento
    }];
    return super.create({ ...assistencia, registo_cronologico } as Assistencia);
  }

  public patch(id: number, assistencia: Partial<Assistencia>) {
    const novoRegisto: EventoCronologico = {
      tecnico_user_id: this.authService.getUserId(),
      estado: assistencia.estado,
      updatedAt: new Date().toLocaleString()
    };
    const updatedRegistoCronologico: EventoCronologico[] = [
      ...assistencia.registo_cronologico,
      novoRegisto
    ];
    return super.patch(
      id,
      { ...assistencia, registo_cronologico: updatedRegistoCronologico } as Assistencia
    );
  }
}
