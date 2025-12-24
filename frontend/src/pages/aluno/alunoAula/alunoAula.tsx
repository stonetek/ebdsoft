/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { AlunoAulas } from "../../../types/alunoAula";
import { fetchAlunoAulas, fetchAlunoAulasPorIgreja } from "../../../utils/api";
import { Pagination, Button } from "react-bootstrap";
import { BsFillPlusCircleFill, BsPencil } from "react-icons/bs";
import { Link } from "react-router-dom";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";

function AlunoAndAulas() {

  const [alunoAulas, setAlunoAulas] = useState<AlunoAulas[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const igrejaId = sessionStorage.getItem('igrejaId');


  
  useEffect(() => {
        const igrejaId = sessionStorage.getItem('igrejaId');
        if (igrejaId && !isNaN(Number(igrejaId))){
          fetchAlunoAulasPorIgreja(Number(igrejaId))
            .then(response => setAlunoAulas(response.data))
            .catch(error => console.log(error));
          } else {
        fetchAlunoAulas().then(response => setAlunoAulas(response.data))
          .catch(error => console.log(error))
        }
      }, []);
  
      const handlePageChange = (page: number) => {
          setCurrentPage(page);
  };
  
  const lowerSearch = search.toLowerCase();
  const filteredAlunoAulas = alunoAulas.filter((aula) => aula.
      licao.toLowerCase().includes(lowerSearch));
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAlunoAulas = filteredAlunoAulas.slice(
    indexOfFirstItem,
    indexOfLastItem
  );    
  
  
  return (
    <>
              <Header/>
              <div className="container mx-auto px-4 mt-6 w-screen h-screen">
              <div className="flex justify-between items-center mt-5">
                <h2 className="text-2xl font-bold mb-4">Lista Aluno e Aula</h2>
                {(!igrejaId || igrejaId === 'null') && (  
                  <a href="/alunosEaulas/new/0" className="flex items-center justify-center w-16 h-10 bg-blue-500 rounded-full ml-48" title="NOVO">
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
                    placeholder="Nome Aula"
                  />
                </div>
  
                  {/* Tabela */}
                  <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto relative">
                      <table className="border-collapse table-auto w-full whitespace-no-wrap bg-white table-striped relative">
                          <thead>
                              <tr className="text-left">
                                  <th className="py-2 px-3 sticky top-0 border-b border-gray-200 bg-gray-100"></th>
                                  <th className="py-2 px-3 sticky top-0 border-b border-gray-200 bg-gray-100">Nome do Aluno</th>
                                  <th className="py-2 px-3 sticky top-0 border-b border-gray-200 bg-gray-100">Nome do Aula</th>
                                  {(!igrejaId || igrejaId === 'null') && (
                                  <th className="py-2 px-3 sticky top-0 border-b border-gray-200 bg-gray-100">Ação</th>
                                  )}
                              </tr>
                          </thead>
                          <tbody>
                              {currentAlunoAulas.map((item, index) => (
                                  <tr key={item.id} className="border-b border-gray-200">
                                      <td className="flex justify-center p-2">{index + 1}</td>
                                      <td className="py-2 px-3">{item.nomeAluno}</td>
                                      <td className="py-2 px-3">{item.licao}</td>
                                      {(!igrejaId || igrejaId === 'null') && (
                                      <td>
                                          <div>
                                              <Link to={`/alunosEaulas/${item.id}`}>
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
                      <Pagination className="justify-content-center mt-4">
                      <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      />
                      {[...Array(Math.ceil(filteredAlunoAulas.length / itemsPerPage))].map(
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
                      disabled={currentPage === Math.ceil(filteredAlunoAulas.length / itemsPerPage)}
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

export default AlunoAndAulas;
