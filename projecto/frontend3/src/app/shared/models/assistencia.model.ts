export interface Assistencia {
    id: number;
    cliente_user_id: number;
    tecnico_user_id: string; // JSON string
    categoria: string;
    marca: string;
    modelo: string;
    cor: string;
    serial: string;
    problema: string;
    orcamento: number;
    relatorio_interno: string;
    relatorio_cliente: string;
    material: JSON;
    preco: number;
    estado: string;
    created_at: string;
    updated_at: string;
}