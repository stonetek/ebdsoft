import { Revista } from "./revista";

export type Pedido = {
    id: number;
    trimestre: string;
    nome: string;
    dataPedido: string;
    dataEntregaPrevista: string;
    status: boolean;
    igreja: number;
    igrejaNome?: string;
    descricao: string;
    total: number;
    revistas: Revista[];
}

export type PedidoPage = {
    content?: Pedido[];
    last: boolean;
    totalElements: number;
    totalPages: number;
    size?: number;
    number: number;
    first: boolean;
    numberOfElements?: number;
    empty?: boolean;
}