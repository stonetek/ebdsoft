export type EbdTurmas = {
    id: number;
    nomeTurma: string,
    nomeEbd: string,
    ebdId: number,
    igrejaId: number,
    idTurma: number,
    ano: string,
}    

export type EbdPage = {
    content?: EbdTurmas[];
    last: boolean;
    totalElements: number;
    totalPages: number;
    size?: number;
    number: number;
    first: boolean;
    numberOfElements?: number;
    empty?: boolean;
}