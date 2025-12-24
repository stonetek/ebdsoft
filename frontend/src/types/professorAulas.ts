export type ProfessorAula = {
    id: number;
    nomeProfessor: string,
    licao: string,
}    

export type ProfessorAulaPage = {
    content?: ProfessorAula[];
    last: boolean;
    totalElements: number;
    totalPages: number;
    size?: number;
    number: number;
    first: boolean;
    numberOfElements?: number;
    empty?: boolean;
}