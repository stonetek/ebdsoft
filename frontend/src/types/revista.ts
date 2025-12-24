export type Revista = {
    id: number;
    nome: string;
    formato: string;
    tipo: string;
    preco: number;
    quantidade: number;
}

export type RevistaPage = {
    content?: Revista[];
    last: boolean;
    totalElements: number;
    totalPages: number;
    size?: number;
    number: number;
    first: boolean;
    numberOfElements?: number;
    empty?: boolean;
}