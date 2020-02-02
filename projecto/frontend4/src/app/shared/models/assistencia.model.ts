import { Artigo } from './artigo.model';
import { Encomenda } from './encomenda.model';
import { Message } from '../components/chat-widget/models/message.model';

export interface Assistencia {
    id: number;
    cliente_user_id: number;
    cliente_user_name?: string;
    cliente_user_contacto?: number;
    registo_cronologico: EventoCronologico[]; // JSON.stringify(data: EventoCronologico[])
    tecnico_user_id?: number;
    tecnico?: string; /* tecnico is extrated & filtered from registo_cronologico */
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
    messages: Partial<Message>[];
    preco: number;
    estado: string;
    createdAt: string;
    updatedAt: string;
}

export interface EventoCronologico {
    editor_user_id?: number; /* this property is required! (only made it non required in code because of backwards compatibility issues) */
    editor?: string;
    editor_action?: 'novo estado' | 'edição';
    tecnico_user_id?: number;
    tecnico?: string;
    relatorio_interno?: string;
    relatorio_cliente?: string;
    material?: Partial<Artigo>[];
    encomendas?: Partial<Encomenda>[];
    messages?: Partial<Message>[];
    preco?: number;
    estado: string;
    updatedAt: string;
}
