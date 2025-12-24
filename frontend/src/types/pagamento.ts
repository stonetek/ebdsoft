export type Parcela = {
    id: number;
    numero: number;
    valor: number;
    dataVencimento: string; // Formate como string para compatibilidade
    atraso: number;
    status: string;
    dataPagamento: string;
    igrejaNome: string;
};

export type parcelasSet = {
    id: number;
    numero: number;
    valor: number;
    dataVencimento: string;
    atraso: number;
    qrCodeUrl: null,
    status: boolean,
    dataPagamento: string

};

export type Pagamento = {
    id: number;
    valorTotal: number;  
    parcelas: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    parcelasSet: parcelasSet[]; // Coleção de PagamentoParcela
};

export type PagamentoPage = {
    content?: Pagamento[];
    last: boolean;
    totalElements: number;
    totalPages: number;
    size?: number;
    number: number;
    first: boolean;
    numberOfElements?: number;
    empty?: boolean;
}