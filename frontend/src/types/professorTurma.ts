export type ProfessorTurma = {
    id: number;
    nomeProfessor: string,
    nomeTurma: string,
}    

export type ProfessorTurmaPage = {
    content?: ProfessorTurma[];
    last: boolean;
    totalElements: number;
    totalPages: number;
    size?: number;
    number: number;
    first: boolean;
    numberOfElements?: number;
    empty?: boolean;
}