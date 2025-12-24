export type Professor = {
    id: number;
    nome: string;
    aniversario: string;
}    

export type ProfessorPage = {
    content?: Professor[];
    last: boolean;
    totalElements: number;
    totalPages: number;
    size?: number;
    number: number;
    first: boolean;
    numberOfElements?: number;
    empty?: boolean;
}

