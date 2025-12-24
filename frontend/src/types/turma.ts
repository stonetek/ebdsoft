export type Turma = {
    id: number;
    nome: string;
    professorTurmas: { id: number }[];
    alunoTurmas: { id: number }[];
    aulaTurmas: { id: number }[];
    idadeMinima: string;
    idadeMaxima: string;
    
}    

export type TurmaPage = {
    content?: Turma[];
    last: boolean;
    totalElements: number;
    totalPages: number;
    size?: number;
    number: number;
    first: boolean;
    numberOfElements?: number;
    empty?: boolean;
}

