export interface Encomenda{
	id: number;
	artigo_id: number;
	assistencia_id: number;
	cliente_id: number;
	observacao: string;
	estado: string
	previsao_entrega: string;
	orcamento: number;
	fornecedor: string
    qty: number;
}