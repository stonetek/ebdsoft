import { Turma } from "./turma";

export type Aluno = {
    id: number;
    nome: string;
    aniversario: string;
    presente: boolean;
    area: string;
    novoConvertido: boolean;
    sexo: string;
    turmas: Turma[];
    matriculado: boolean;
}

export type AlunoPage = {
    content?: Aluno[];
    last: boolean;
    totalElements: number;
    totalPages: number;
    size?: number;
    number: number;
    first: boolean;
    numberOfElements?: number;
    empty?: boolean;
}