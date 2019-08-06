import { Artigo } from './artigo.model';
import { Encomenda } from './encomenda.model';

export interface Assistencia {
    id: number;
    cliente_user_id: number;
    cliente_user_name?: string;
    cliente_user_contacto?: number;
    registo_cronologico: EventoCronologico[]; // JSON.stringify(data: EventoCronologico[])
    tecnico?: string; // tecnico is extrated & filtered from registo_cronologico
    categoria: string;
    marca: string;
    modelo: string;
    cor: string;
    serial: string;
    problema: string;
    orcamento: number;
    relatorio_interno: string;
    relatorio_cliente: string;
    material: Partial<Artigo>[];
    encomendas: Partial<Encomenda>[];
    preco: number;
    estado: string;
    createdAt: string;
    updatedAt: string;
}

export interface EventoCronologico {
    tecnico_user_id: number;
    tecnico?: string;
    estado: string;
    updatedAt: string;
}
