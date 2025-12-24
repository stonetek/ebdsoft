export type IgrejaEbd = {
    [x: string]: Key | null | undefined;
    id: number;
    nomeIgreja: string,
    nomeEbd: string,
    idIgreja: number,
    IdEbd: number,
}    

export type EbdPage = {
    content?: IgrejaEbd[];
    last: boolean;
    totalElements: number;
    totalPages: number;
    size?: number;
    number: number;
    first: boolean;
    numberOfElements?: number;
    empty?: boolean;
}