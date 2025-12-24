export type AlunoAulas = {
    id: number;
    nomeAluno: string,
    licao: string,
}    

export type AlunoAulasPage = {
    content?: AlunoAulas[];
    last: boolean;
    totalElements: number;
    totalPages: number;
    size?: number;
    number: number;
    first: boolean;
    numberOfElements?: number;
    empty?: boolean;
}