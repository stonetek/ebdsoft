export type TurmaRelatorio = {
    nomeTurma: string,
    totalMatriculados: number,
    totalPresentes: number,
    totalAusentes: number,
    totalVisitantes: number,
    totalAssistencia: number,
    totalBiblias: number,
    totalRevistas: number,
    totalOferta: number
}

export type Relatorio = {
    totalMatriculados: number,
    totalPresentes: number,
    totalAusentes: number,
    totalVisitantes: number,
    totalAssistencia: number,
    totalBiblias: number,
    totalRevistas: number,
    totalOferta: number,
    turmas: TurmaRelatorio[]
}

export type RelatorioPage = {
    content?: Relatorio[];
    last: boolean;
    totalElements: number;
    totalPages: number;
    size?: number;
    number: number;
    first: boolean;
    numberOfElements?: number;
    empty?: boolean;
}