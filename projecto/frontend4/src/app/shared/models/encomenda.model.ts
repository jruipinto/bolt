import { EventoCronologico } from './assistencia.model';

export interface Encomenda {
    id: number;
    artigo_id: number;
    assistencia_id: number;
    cliente_user_id: number;
    observacao: string;
    registo_cronologico: EventoCronologico[]; // JSON.stringify(data: EventoCronologico[])
    estado: string;
    previsao_entrega: string;
    orcamento: number;
    fornecedor: string;
    qty: number;
}
