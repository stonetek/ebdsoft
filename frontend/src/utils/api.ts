/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BASE_URL }  from "./../utils/requests";
import { Igreja } from "../types/igreja";
import { Aluno } from "../types/aluno";
import api from "../service/api";

const id = document.getElementById('id')?.ariaValueText;
//const nome = document.getElementById('nome')?.ariaValueText
//let developerName = document.getElementById('developerName')?.ariaValueText

const API_URL = BASE_URL;



/*chamada da api classe igreja inicio*/
export function fetchIgrejas() {
    return api.get(`${API_URL}/api/igrejas`);
}

export function fetchIgrejasPublicas() {
    return api.get(`${API_URL}/api/igrejas/publica`);
}

export function fetchIgrejaEbd() {
    return api.get(`${API_URL}/api/igrejas/igreja-ebds`)
}

export function fetchIgrejaAndEbd(idIgreja: any) {
    return api.get(`${API_URL}/api/igrejas/${idIgreja}/ebds`)
}

export function fetchEbdAndTurmasByIgreja(idIgreja: number) {
    return api.get(`${API_URL}/api/igrejas/${idIgreja}/ebd-turmas`)
}

export function fetchEbdAndTurmasByIgrejas(idIgreja: number) {
    return api.get(`${API_URL}/api/igrejas/${idIgreja}/ebd-turmas-new`)
}

export function fetchIgrejaById(idIgreja: number) {
    return api.get(`${API_URL}/api/igrejas/${idIgreja}`)
}

export function fetchIgrejaEbdVinculo(idIgreja: number) {
    return api.get(`${API_URL}/api/igrejas/igreja-ebd-vinculo/${idIgreja}`)
}

/*chamada da api classe igreja fim*/


/* chamada da api classe aluno inicio */
export function fetchAlunos() {
    return api.get(`${API_URL}/api/alunos`)
}
export function fetchAlunoAulas() {
    return api.get(`${API_URL}/api/alunos/aluno-aulas`);
}

export function fetchAlunoAulasPorIgreja(igrejaId: number) {
    return api.get(`${API_URL}/api/alunos/aluno-aulas/${igrejaId}`);
}

export function fetchAlunosByTurma(idTurma: number) {
    return api.get(`${API_URL}/api/alunos/turma/${idTurma}`);
}

export function fetchAlunoAndAulas(filtro: any) {
    return api.post(`${API_URL}/api/alunos/aulas`, filtro);
}


export function fetchAlunosElegiveis(idTurma: any) {
    return api.get(`${API_URL}/api/alunos/turmas/${idTurma}/alunosElegiveis`);
}

export function fetchAlunoPorIgreja(idIgreja: number) {
    return api.get(`${API_URL}/api/alunos/igreja/${idIgreja}`);
}

/* chamada da api classe aluno fim */



/* chamada da api classe professor inicio */

export function fetchProfessores() {
    return api.get(`${API_URL}/api/professores`)
}

export function fetchProfessorAT(userProfile: string , userId: number, igrejaId: number) {
    const params: any = {
        userProfile: userProfile,
        userId: userId
    };

    if (igrejaId !== null && !isNaN(igrejaId)) {
        params.igrejaId = igrejaId;
    }

    return api.get(`${API_URL}/api/professores/aulas`, { params });
}

export function fetchProfessorTurmas() {
    return api.get(`${API_URL}/api/professores/professor-turmas`);
}

export function fetchProfessorAulas() {
    return api.get(`${API_URL}/api/professores/professor-aulas`);
}


export function fetchProfessorPorIgreja(idIgreja: number) {
    return api.get(`${API_URL}/api/professores/igreja/${idIgreja}`);
}

export function fetchProfessorTurmasPorIgreja(igrejaId: number) {
    return api.get(`${API_URL}/api/professores/professor-turmas/${ igrejaId }`);
}


export function fetchProfessorAulasPorIgreja(igrejaId: number) {
    return api.get(`${API_URL}/api/professores/professor-aulas/${ igrejaId }`);
}

export function fetchProfessorAula(id: number) {
    return api.post(`${API_URL}/api/professores/aulasPorProfessor`, { id });
}

export function fetchProfessorTurma(professorId: number) {
    return api.post(`${API_URL}/api/professores/buscar-por-professor`, { professorId })
}

export function fetchProfessorAluno(professorId: number) {
    return api.post(`${API_URL}/api/professores/aluno-por-professor`, { professorId })
}

/* chamada da api classe professor fim */







/* chamada da api classe ebd inicio */

export function fetchEbds() {
    return api.get(`${API_URL}/api/escolabiblica`)
}

export function fetchEbdPorIgreja(igrejaId:number) {
    return api.get(`${API_URL}/api/escolabiblica/igreja/${igrejaId}`)
}

export function fetchNiver() {
    return api.get(`${API_URL}/api/escolabiblica/aniversariantes/mes`)
}

export function fetchNiverTrimestre() {
    return api.get(`${API_URL}/api/escolabiblica/aniversariantes/trimestre`)
}

export function fetchRelatorio(data: string, idEbd: number, mes?: number, trimestre?: number, ano?: number) {
    return api.post(`${API_URL}/api/escolabiblica/data`, {
      idEbd: idEbd,
      data: data,
      mes: mes,
      trimestre: trimestre,
      ano: ano
    });
}

export function fetchNiverPorIgreja(igrejaId:number) {
    return api.get(`${API_URL}/api/escolabiblica/aniversariantes/mes/${igrejaId}`)
}

export function fetchNiverTrimestrePOrIgreja(igrejaId:number) {
    return api.get(`${API_URL}/api/escolabiblica/aniversariantes/trimestre/${igrejaId}`)
}

  
/* chamada da api classe ebd fim */




/* chamada da api aula inicio */

export function fetchAulas() {
    return api.get(`${API_URL}/api/aulas/aulascomturmas`)
}

export function fetchOfertas(turmaId: number, mes: number | null, trimestre: number | null, ano: number) {
    return api.post(`${API_URL}/api/aulas/ofertas`, {
        turmaId,
        mes,
        trimestre,
        ano
    });
}

export function fetchAulaTurmas() {
    return api.get(`${API_URL}/api/aulas/aula-turmas`);
}

export function fetchAulaTurmasPorIgreja(igrejaId: number) {
    return api.get(`${API_URL}/api/aulas/aulaeturmas/${igrejaId}`);
}


export function fetchAulasPorIgreja(igrejaId: any) {
    return api.get(`${API_URL}/api/aulas/igreja/${igrejaId}`);
}

/* chamada da api aula fim */


/* chamada da api turma inicio */

export function fetchTurmas() {
    return api.get(`${API_URL}/api/turmas`)
}



export function fetchEbdTurmas() {
    return api.get(`${API_URL}/api/turmas/ebd-turmas`);
}

export function fetchAlunoTurmas() {
    return api.get(`${API_URL}/api/alunos/aluno-turmas`);
}

export function fetchAulasByTurma(idTurma: number) {
    return api.get(`${API_URL}/api/turmas/${idTurma}/aulas`);
}

export function fetchTurmasPorEbd(idEbd: number) {
    return api.get(`${API_URL}/api/turmas/ebd/${idEbd}`)
}

export function fetchAlunoTurmasPorIgreja(igrejaId: number) {
    return api.get(`${API_URL}/api/alunos/aluno-turmas/${ igrejaId }`);
}

export function fetchTurmasPorIgreja(igrejaId: number) {
    return api.get(`${API_URL}/api/aulas/igreja-turmas/${ igrejaId }`);
}


/* chamada da api turma fim */


/* chamada da api revista inicio */

export function fetchRevistas() {
    return api.get(`${API_URL}/api/revistas`);
}

export function fetchRevistasPorIgreja(igrejaId: number) {
    return api.post(`${API_URL}/api/revistas/por-igreja`, {id:igrejaId});
}




/* chamada da api revista fim */


/**Novas chamadas */

export function fetchAlunosPorFaixaEtaria(nomeTurma: string) {
    return api.post(`${API_URL}/api/turmas/alunos-por-faixa-etaria`, {
        nomeTurma,
    });
}

export function matricularAlunos(turmaId: number, alunosIds: number[]) {
    return api.post(`${API_URL}/api/turmas/matricular-aluno`, {
        turmaId,
        alunosIds,
    });
}


//  Usuario

export function registerUser(userData: any){
    return api.post(`${API_URL}/api/auth/register`, userData)
}


export function fetchUsuario() {
    return api.get(`${API_URL}/api/usuarios`)
}

export function fetchUsuarioPorNome(nome: string) {
    return api.post(
        `${API_URL}/api/usuarios/pornome`,
        { nome },
        { headers: { 'Content-Type': 'application/json' } }
    );
}

export function fecthVincularUsuario(data: { tipoEntidade: string; entidadeId: number; usuarioId: number; }) {
    return api.post(`${API_URL}/api/usuarios/vincular`, data)
}


export function fetchPerfilPorNome(nome: string) {
    return api.post(
        `${API_URL}/api/perfil/pornome`,
        { nome },
        { headers: { 'Content-Type': 'application/json' } }
    );
}

export function fecthVincularPerfil(data: { tipoEntidade: string; entidadeId: number; perfilId: number; }) {
    return api.post(`${API_URL}/api/perfil/vincular`, data)
}

export function fetchUserPorIgreja(igrejaId: number) {
    return api.get(`${API_URL}/api/usuarios/igreja/${igrejaId}`);
}


//Pedido

export function fetchPedido() {
    return api.get(`${API_URL}/api/pedidos`)
}


export function fetchPedidoPorIgreja(igrejaId: number) {
    return api.get(`${API_URL}/api/pedidos/por-igreja/${igrejaId}`);
}



//Pagamento

export function fetchPagamentos() {
    return api.get(`${API_URL}/api/pagamentos`);
}

export function fetchPagamentoPorIgreja(igrejaId: number) {
    return api.get(`${API_URL}/api/pagamentos/por-igreja/${igrejaId}`);
}


//Parcela

export function fetchParcelas() {
    return api.get(`${API_URL}/api/parcelas`)
}

export function fetchParcelaIgreja(igrejaId: number) {
    return api.post(`${API_URL}/api/parcelas/por-igreja`, {igrejaId})
}

export function fetchPagarParcela(parcelaId: number) {
    return api.post(`${API_URL}/api/parcelas/pagar/${parcelaId}`);
}












// Sem uso

//perfil

export function fecthPerfil() {
    return api.get(`${API_URL}/api/perfil`)
}


// Turmas
export async function fetchNewTurmas(_Turma: any) {
    return api.post(`${API_URL}/api/turmas/{idTurma}`)
}

export function fetchEditTurmas() {
    return api.put(`${API_URL}/api/trumas/${id}`)
}

export function fetchDelTurma() {
    return api.delete(`${API_URL}/api/turmas/`)
}

export function fetchEbdTurma(nomeTurma: string, nomeEbd: string) {
    return api.post(`${API_URL}/api/turmas/vincular`,{
        nomeTurma,
        nomeEbd,
    });
}


//Aula

export async function fetchNewAulas(_Aula: any) {
    return api.post(`${API_URL}/api/alunos/{idAulas}`)
}

export function fetchEditAulas() {
    return api.put(`${API_URL}/api/aulas/${id}`)
}

export function fetchDelAula() {
    return api.delete(`${API_URL}/api/aulas/`)
}

export function fetchTrimestre() {
    return api.post(`${API_URL}/api/aulas/buscar-por-trimestre`)
}

// EBD

export async function fetchNewEbds(_Ebd: any) {
    return api.post(`${API_URL}/api/escolabiblica/{idAluno}`)
}

export function fetchEditEbds() {
    return api.put(`${API_URL}/api/escolabiblica/${id}`)
}

export function fetchDelEbd() {
    return api.delete(`${API_URL}/api/escolabiblica/`)
}


// Professores

export async function fetchNewProfessores(_Professor: any) {
    return api.post(`${API_URL}/api/professores/{idProfessor}`)
}

export function fetchEditProfessores() {
    return api.put(`${API_URL}/api/professores/${id}`)
}

export function fetchDelProfessor() {
    return api.delete(`${API_URL}/api/professores/`)
}

// Alunos

export function fetchAlunoTurmaVinculo(idAlunoTurma:any) {
    return api.post(`${API_URL}/api/alunos/aluno-turma-vinculo/${idAlunoTurma}`);
}


export function fetchAlunoPorIgrejaArea(turmaId: number) {
    return api.get(`${API_URL}/api/alunos/turma/${turmaId}/area`);
}

export async function fetchNewAlunos(_Aluno: Aluno) {
    return api.post(`${API_URL}/api/alunos/{idAluno}`)
}

export function fetchEditAlunos() {
    return api.put(`${API_URL}/api/alunos/${id}`)
}

export function fetchDelAluno() {
    return api.delete(`${API_URL}/api/alunos/`)
}


// Igrejas

export async function fetchNewIgrejas(_Igreja: Igreja) {
    return api.post(`${API_URL}/api/igrejas/{idIgreja}`)
}

export function fetchEditIgrejas() {
    return api.put(`${API_URL}/api/igrejas/${id}`)
}

export function fetchDelIgreja() {
    return api.delete(`${API_URL}/api/igrejas/`)
}