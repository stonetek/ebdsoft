/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Table  from "react-bootstrap/Table";
import { fetchAulas, fetchAulasPorIgreja, fetchProfessorAula } from "../../utils/api";
import Pagination from "react-bootstrap/Pagination";
import { Aula } from "../../types/aula";
import { formatLocalDate } from "../../utils/format";
import { Link } from "react-router-dom";
import { BsFillPlusCircleFill, BsPencil } from "react-icons/bs";
import { Aluno } from "../../types/aluno";
import AlunosModal from "../../pages/aluno/modal/alunoModal";


interface alunoAulas {
  id: number;
  idAluno: number;
  nomeAluno: string;
  idAula: number;
  licao: string;
  presente: boolean;
  nome: string
}


function DataTableAula() {

  const [aula, setAula] =  useState<Aula[]>([])
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [selectedAlunosPorTurma, setSelectedAlunosPorTurma] = useState<Aluno[]>([]);
  const [selectedAlunoAulas, setSelectedAlunoAulas] = useState<alunoAulas[]>([]);
  const [selectedTurma, setSelectedTurma] = useState<string>('');
  const nomePerfil = sessionStorage.getItem('nomePerfil');

  useEffect(() => {
    const igrejaId = sessionStorage.getItem('igrejaId');
    const classeId = sessionStorage.getItem("classeId");

    const carregarAulas = async () => {
      try {
        if (classeId && !isNaN(Number(classeId))) {
          const response = await fetchProfessorAula(Number(classeId));
            setAula(response.data);
            } else if (igrejaId && !isNaN(Number(igrejaId))) {
                const response = await fetchAulasPorIgreja(Number(igrejaId));
                setAula(response.data);
            } else {
                const response = await fetchAulas();
                setAula(response.data);
            }
      } catch (error) {
        console.error("Erro ao buscar aulas:", error);
      }
    };

    carregarAulas();
  }, []);


  const handlePageChange = (page: number) => {
        setCurrentPage(page);
  };

  const handleShowModal = (aulasTurmas:any, alunoAulas:any) => {
    const alunosPorTurma = alunoAulas.map((alunoAula:any) => ({
        id: alunoAula.idAluno,
        nome: alunoAula.nomeAluno,
        presente: alunoAula.presente,
    }));
    const nomeTurma = aulasTurmas.length > 0 ? aulasTurmas[0].nomeTurma : "Sem turma";
    setSelectedAlunosPorTurma(alunosPorTurma);
    setSelectedAlunoAulas(alunoAulas);
    setSelectedTurma(nomeTurma);
    setShowModal(true);
  };

  
  
  const handleCloseModal = () => setShowModal(false);

  const lowerSearch = search.toLowerCase();
  const filteredAulas = Array.isArray(aula) ? aula.filter((aula) => {
    return aula.licao && aula.licao.toLowerCase().includes(lowerSearch);
  }) : [];
  

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAulas = filteredAulas.slice(
    indexOfFirstItem,
    indexOfLastItem
  );    



  return (
    <>
      <div className="flex justify-between mb-2 rounded-3xl w-screen p-5 mt-16">
        <div className="flex justify-start w-screen">
          <input
            className="mr-2 text-center bg-slate-500"
            type="text"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="digite lição"
          />
        </div>

          <a href="/aulas/new/0" className="flex items-center  w-16 h-10 
          bg-blue-500 rounded-full mt-5" title="NOVO">
            <BsFillPlusCircleFill className="w-32 h-20 text-blue-600"/>
          </a>
        
        </div>

        
      <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th></th>
                    <th>Trimestre</th>
                    <th>Data</th>
                    <th>Lição</th>
                    <th>Professor</th>
                    <th>Alunos Matriculados</th>
                    <th>Presentes</th>
                    <th>Ausentes</th>
                    <th>Visitantes</th>
                    <th>Total de assistência</th>
                    <th>Bíblias</th>
                    <th>Revistas</th>
                    <th>Oferta</th>
                    <th>Turma</th>
                    <td>Ação</td>
                  </tr>
                </thead>
                <tbody>
                  {currentAulas.map((aula, index) => (
                    <tr key={`${aula.id}-${index}`}>
                      <td>{index + 1}</td>
                      <td>{aula.trimestre}</td>
                      <td>{formatLocalDate(aula.dia, "dd/MM/yyy")}</td>
                      <td>{aula.licao}</td>
                      <td>
                        {aula.professorAulas.map((professor, ProfessorIndex) => (
                          <div key={`${ProfessorIndex}`}>{professor.nomeProfessor}</div>
                        ))}
                      </td>
                      <td>{aula.alunosMatriculados}</td>
                      <td>{aula.presentes}</td>
                      <td>{aula.ausentes}</td>
                      <td>{aula.visitantes}</td>
                      <td>{aula.totalAssistencia}</td>
                      <td>{aula.biblias}</td>
                      <td>{aula.revistas}</td>
                      <td>{aula.oferta.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                      {/* Renderizar lista de turmas com opção de abrir modal ao clicar */}
                      <td>
                          {aula.aulasTurmas && aula.aulasTurmas.map((turma, turmaIndex) => (
                            <div 
                              key={`${turma.id}-${turmaIndex}`} 
                              style={{ cursor: 'pointer', color: 'blue' }} 
                              onClick={() => handleShowModal(aula.aulasTurmas, aula.alunoAulas)}
                            >
                              {turma.nomeTurma}
                            </div>
                          ))}
                      </td>

                      <td>{
                        
                        <div>

                        {nomePerfil !== 'professor' ? (
                                <Link to={`/aulas/${aula.id}`}>
                                    <button className="w-14 h-10 flex-col" title="EDITAR">
                                        <BsPencil className="w-20 h-6 mt-2" color="yellow" />
                                    </button>
                                </Link>
                            ) : (
                                <div>
                                    <button className="w-14 h-10 flex-col" title="Professor não pode editar aulas" disabled>
                                        <BsPencil className="w-20 h-6 mt-2" color="gray" />
                                    </button>
                                </div>
                            )}

                        </div>
                      
                      }</td>
                    </tr>
                  ))}
                </tbody>
      </Table>

      <AlunosModal show={showModal} handleClose={handleCloseModal} alunosPorTurma={selectedAlunosPorTurma} alunoAulas={selectedAlunoAulas} turma={""} />

      {/* Paginação */}
      <Pagination className="justify-content-center">
                <Pagination.Prev
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {[...Array(Math.ceil(filteredAulas.length / itemsPerPage))].map(
                  (_, pageIndex) => (
                    <Pagination.Item
                      key={`page-${pageIndex}`}
                      active={pageIndex + 1 === currentPage}
                      onClick={() => handlePageChange(pageIndex + 1)}
                    >
                      {pageIndex + 1}
                    </Pagination.Item>
                  )
                )}
                <Pagination.Next
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === Math.ceil(filteredAulas.length / itemsPerPage)}
                />
      </Pagination>
    </>
  );

}

export default DataTableAula;