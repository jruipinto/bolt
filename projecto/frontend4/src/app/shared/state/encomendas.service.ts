import { Injectable } from '@angular/core';
import { EncomendasApiService, AuthService } from 'src/app/shared/services';
import { EntityStateAbstraction } from 'src/app/shared/abstraction-classes';
import { Artigo, Encomenda, EventoCronologico } from '..';
import { map, concatMap, mergeMap } from 'rxjs/operators';
import { concat } from 'rxjs';
import { ArtigosService } from './artigos.service';
import { UsersService } from './users.service';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class EncomendasService extends EntityStateAbstraction {

  constructor(
    protected encomendasAPI: EncomendasApiService,
    private authService: AuthService,
    private artigosService: ArtigosService,
    private usersService: UsersService) {
    super(encomendasAPI);
  }

  public get(id: number) {
    return super.get(id)
      .pipe(
        map((res: Encomenda[]) => res[0]),
        concatMap(encomenda => this.artigosService.get(encomenda.artigo_id)
          .pipe(
            map((dbArtigo: Artigo[]) => dbArtigo[0]),
            map(dbArtigo => ({
              ...encomenda,
              artigo_marca: dbArtigo.marca,
              artigo_modelo: dbArtigo.modelo,
              artigo_descricao: dbArtigo.descricao,
            }))
          )
        ),
        concatMap(encomenda => this.usersService.get(encomenda.cliente_user_id)
          .pipe(
            map((dbUser: User[]) => dbUser[0]),
            map(dbUser => ({
              ...encomenda,
              cliente_user_name: dbUser.nome,
              cliente_user_contacto: dbUser.contacto
            }))
          )
        ),
        map(res => [res])
      );
  }

  public getAndWatch(id: number) {
    return super.getAndWatch(id)
      .pipe(
        map((res: Encomenda[]) => res[0]),
        mergeMap(encomenda => this.artigosService.get(encomenda.artigo_id)
          .pipe(
            map((dbArtigo: Artigo[]) => dbArtigo[0]),
            map(dbArtigo => ({
              ...encomenda,
              artigo_marca: dbArtigo.marca,
              artigo_modelo: dbArtigo.modelo,
              artigo_descricao: dbArtigo.descricao,
            }))
          )
        ),
        mergeMap(encomenda => this.usersService.get(encomenda.cliente_user_id)
          .pipe(
            map((dbUser: User[]) => dbUser[0]),
            map(dbUser => ({
              ...encomenda,
              cliente_user_name: dbUser.nome,
              cliente_user_contacto: dbUser.contacto
            }))
          )
        ),
        map(res => [res])
      );
  }

  public create(encomenda: Partial<Encomenda>) {
    const registo_cronologico: EventoCronologico[] = [{
      tecnico_user_id: this.authService.getUserId(),
      estado: encomenda.estado,
      updatedAt: new Date().toLocaleString() // dia/mes/ano, hora:minuto:segundo naquele momento
    }];
    return super.create({ ...encomenda, registo_cronologico } as Encomenda);
  }

  public patch(id: number, encomenda: Partial<Encomenda>) {
    const novoRegisto: EventoCronologico = {
      tecnico_user_id: this.authService.getUserId(),
      estado: encomenda.estado,
      updatedAt: new Date().toLocaleString()
    };
    const updatedRegistoCronologico: EventoCronologico[] = [
      ...encomenda.registo_cronologico,
      novoRegisto
    ];
    return super.patch(
      id,
      { ...encomenda, registo_cronologico: updatedRegistoCronologico } as Encomenda
    );
  }
}
