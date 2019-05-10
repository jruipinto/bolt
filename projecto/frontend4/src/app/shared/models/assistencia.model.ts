export interface Assistencia {
    id: number;
    cliente_user_id: number;
    cliente_user_name?: string;
    cliente_user_contacto?: number;
    registo_cronologico: string; // JSON.stringify(data: EventoCronologico[])
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
    createdAt: string;
    updatedAt: string;
}

export interface EventoCronologico {
    tecnico_user_id: number;
    estado: string;
    updatedAt: string;
}
