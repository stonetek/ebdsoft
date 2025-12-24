import { Turma } from "./turma";

export type AulaTurma = {
    id: number;
    idAula: number;
    idTurma: number;
    licao: string;
    nomeTurma: string;
};

export type Aula = {
    id: number;
    licao: string;
    dia: string;
    professorAulas: { nomeProfessor: string }[];
    alunosMatriculados: string;
    trimestre: string;
    ausentes: string;
    presentes: string;
    visitantes: string;
    totalAssistencia: string;
    biblias: string;
    revistas: string;
    oferta: number;
    turmas: Turma[];
    alunosPorTurma: [];
    alunoAulas: [];
    aulasTurmas: AulaTurma[]; 
}

export type AulaPage = {
    content?: Aula[];
    last: boolean;
    totalElements: number;
    totalPages: number;
    size?: number;
    number: number;
    first: boolean;
    numberOfElements?: number;
    empty?: boolean;
}