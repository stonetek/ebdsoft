export type AlunoTurmas = {
    id: number;
    nomeTurma: string,
    nomeAluno: string,
}    

export type EbdPage = {
    content?: AlunoTurmas[];
    last: boolean;
    totalElements: number;
    totalPages: number;
    size?: number;
    number: number;
    first: boolean;
    numberOfElements?: number;
    empty?: boolean;
}