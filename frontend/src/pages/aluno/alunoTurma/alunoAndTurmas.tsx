/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { AlunoTurmas } from "../../../types/alunoTurmas";
import { fetchAlunoTurmas, fetchAlunoTurmasPorIgreja } from "../../../utils/api";
import Header from "../../../components/header/header";
import { BsFillPlusCircleFill, BsPencil } from "react-icons/bs";
import { Link } from "react-router-dom";
import { Button, Pagination } from "react-bootstrap";
import Footer from "../../../components/footer/footer";

function AlunoAndTurmas() {

    const [alunoTurmas, setAlunoTurmas] = useState<AlunoTurmas[]>([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const igrejaId = sessionStorage.getItem('igrejaId');
  
  
    useEffect(() => {
      const igrejaId = sessionStorage.getItem('igrejaId');
      if (igrejaId && !isNaN(Number(igrejaId))){
        fetchAlunoTurmasPorIgreja(Number(igrejaId))
        .then(response => setAlunoTurmas(response.data))
        .catch(error => console.log(error));
        } else {
        fetchAlunoTurmas().then(response => setAlunoTurmas(response.data))
          .catch(error => console.log(error))
        }
    }, []);
  
    
    const handlePageChange = (page: number) => {
          setCurrentPage(page);
    };
  
    const lowerSearch = search.toLowerCase();
    const filteredAlunoTurmas = alunoTurmas.filter((turma) => turma.
      nomeTurma.toLowerCase().includes(lowerSearch));
  
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAlunoTurmas = filteredAlunoTurmas.slice(
      indexOfFirstItem,
      indexOfLastItem
    );    
  
  
      return (
          <>
              <Header/>
                <div className="container mx-auto px-4 mt-8 w-screen h-screen">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold mb-4 mt-5">Matrícula de Alunos em Turmas</h2>
                        {(!igrejaId || igrejaId === 'null') && (
                        <a href="/alunosEturmas/new/0" className="flex items-center justify-center w-16 h-10 bg-blue-500 rounded-full" title="NOVO">
                            <BsFillPlusCircleFill className="w-20 h-16 text-blue-600"/>
                        </a>
                         )}
                    </div>

                    <div className="flex justify-start w-screen -mt-12">   
                  <input
                    className="text-center border-b border-gray-200 bg-gray-100 h-8 w-56 mb-5"
                    type="text"
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    placeholder="Nome Turma"
                  />
                </div>

  
                    {/* Tabela */}
                    <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto relative">
                      <table className="border-collapse table-auto w-full whitespace-no-wrap bg-white table-striped relative">
                          <thead>
                              <tr className="text-left">
                                  <th className="py-2 px-3 sticky top-0 border-b border-gray-200 bg-gray-100"></th>
                                  <th className="py-2 px-3 sticky top-0 border-b border-gray-200 bg-gray-100">Nome da Turma</th>
                                  <th className="py-2 px-3 sticky top-0 border-b border-gray-200 bg-gray-100">Nome do Aluno</th>
                                  {(!igrejaId || igrejaId === 'null') && (
                                  <th className="py-2 px-3 sticky top-0 border-b border-gray-200 bg-gray-100">Ação</th>
                                )}
                              </tr>
                          </thead>
                          <tbody>
                              {currentAlunoTurmas.map((item, index) => (
                                  <tr key={item.id} className="border-b border-gray-200">
                                      <td className="flex justify-center p-2">{index + 1}</td>
                                      <td className="py-2 px-3">{item.nomeTurma}</td>
                                      <td className="py-2 px-3">{item.nomeAluno}</td>
                                      {(!igrejaId || igrejaId === 'null') && (
                                      <td>
                                          <div>
                                              <Link to={`/editarAlunosEturmas/${item.id}`}>
                                                  <button className="w-14 h-10 flex-col" title="EDITAR">
                                                      <BsPencil className="w-20 h-6 mt-2" color="green"/>
                                                  </button>
                                              </Link>
                                          </div>
                                      </td>
                                       )}
                                  </tr>
                              ))}
                          </tbody>
                        </table>
                        <Pagination className="justify-content-center">
                            <Pagination.Prev
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            />
                            {[...Array(Math.ceil(filteredAlunoTurmas.length / itemsPerPage))].map(
                            (_, index) => (
                                <Pagination.Item
                                key={index}
                                active={index + 1 === currentPage}
                                onClick={() => handlePageChange(index + 1)}
                                >
                                {index + 1}
                                </Pagination.Item>
                            )
                            )}
                            <Pagination.Next
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === Math.ceil(filteredAlunoTurmas.length / itemsPerPage)}
                            />
                        </Pagination>
                    </div>
                  <Button as="a" href="/alunos" className="mt-2">VOLTAR</Button>
              </div>
              <footer>
                <Footer/>
            </footer>
          </>
      )
  }
  
  export default AlunoAndTurmas;