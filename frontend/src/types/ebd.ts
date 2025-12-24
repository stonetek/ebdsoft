import { ReactNode } from "react";

export type Ebd = {
    nomeEbd: ReactNode;
    id: number;
    nome: string,
    coordenador: string,
    viceCoordenador: string,
    presbitero: string,
    ano: string,
    nomeTurma: [],
}    

export type EbdPage = {
    content?: Ebd[];
    last: boolean;
    totalElements: number;
    totalPages: number;
    size?: number;
    number: number;
    first: boolean;
    numberOfElements?: number;
    empty?: boolean;
}