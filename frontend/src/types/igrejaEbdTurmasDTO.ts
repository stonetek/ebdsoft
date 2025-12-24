import { Ebd } from "./ebd";
import { Turma } from "./turma";

export type IgrejaEbdTurmasDTO = {
    ebd: Ebd[];
  turmas: Turma[];
  ebdNome: string;
  nomeTurma: string;
}    

export type EbdPage = {
    content?: IgrejaEbdTurmasDTO[];
    last: boolean;
    totalElements: number;
    totalPages: number;
    size?: number;
    number: number;
    first: boolean;
    numberOfElements?: number;
    empty?: boolean;
}