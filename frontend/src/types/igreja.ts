export type Igreja = {
    id: number,
    nome: string,
    endereco: string,
    bairro: string,
    cidade: string,
    cnpj: string,
    cep: string,
    area: string,
}

export type IgrejaPage = {
    content?: Igreja[];
    last: boolean;
    totalElements: number;
    totalPages: number;
    size?: number;
    number: number;
    first: boolean;
    numberOfElements?: number;
    empty?: boolean;
}