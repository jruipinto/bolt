import { EventoCronologico } from './assistencia.model';

export interface Encomenda {
    id: number;
    artigo_id: number;
    artigo_marca?: string;
    artigo_modelo?: string;
    artigo_descricao?: string;
    assistencia_id: number;
    cliente_user_id: number;
    cliente_user_name?: string;
    cliente_user_contacto?: number;
    observacao: string;
    registo_cronologico: EventoCronologico[]; // JSON.stringify(data: EventoCronologico[])
    estado: string;
    previsao_entrega: string;
    orcamento: number;
    fornecedor: string;
    qty: number;
    createdAt?: Date;
    updatedAt?: Date;
}
