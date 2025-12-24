export type AulaTurma = {
    id: number;
    licao: string,
    nomeTurma: string,
}    

export type AulaTurmaPage = {
    content?: AulaTurma[];
    last: boolean;
    totalElements: number;
    totalPages: number;
    size?: number;
    number: number;
    first: boolean;
    numberOfElements?: number;
    empty?: boolean;
}