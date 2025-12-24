import { useEffect, useState } from "react";
import Table  from "react-bootstrap/Table";
import { fetchProfessorTurma, fetchTurmas, fetchTurmasPorIgreja } from "../../utils/api";
import Pagination from "react-bootstrap/Pagination";
import { Turma } from "../../types/turma";
import { BsFillPlusCircleFill, BsPencil } from "react-icons/bs";
import { Link } from "react-router-dom";



function DataTableTurma() {

  const [turma, setTurma] =  useState<Turma[]>([])
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const igrejaId = sessionStorage.getItem('igrejaId');
    const classeId = sessionStorage.getItem("classeId");

    const carregarTurmas = async () => {
      try {
            if (classeId && !isNaN(Number(classeId))) {
                const response = await fetchProfessorTurma(Number(classeId));
                setTurma(response.data);
            } else if (igrejaId && !isNaN(Number(igrejaId))) {
                const response = await fetchTurmasPorIgreja(Number(igrejaId));
                setTurma(response.data);
            } else {
                const response = await fetchTurmas();
                setTurma(response.data);
            }
      } catch (error) {
            console.error("Erro ao buscar turmas:", error);
        }
    };

    carregarTurmas();
}, []);


  const handlePageChange = (page: number) => {
        setCurrentPage(page);
  };

    
  const lowerSearch = search.toLowerCase();
  const filteredTurmas = turma.filter((turma) => turma.
    nome.toLowerCase().includes(lowerSearch));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTurmas = filteredTurmas.slice(
        indexOfFirstItem,
        indexOfLastItem
  );    



  return (
            <>
              <div className="flex justify-between mb-2 rounded-3xl w-screen p-5 -mt-16">
                <div className="flex justify-start w-screen">
                  <input
                    className="mr-2 text-center bg-slate-500"
                    type="text"
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    placeholder="digite nome"
                  />
                </div>
                <a href="/classes/new/0" className="flex items-center justify-center w-16 h-10 bg-blue-500 rounded-full mt-10" title="NOVO">
                  <BsFillPlusCircleFill className="w-32 h-20 text-blue-600"/>
                </a>

              </div>
        
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th></th>
                    <th>Classes</th>
                    <th>Idade Mínima</th>
                    <th>Idade Máxima</th>
                    <td>Ação</td>
                  </tr>
                </thead>
                <tbody>
                  {currentTurmas.map((turma, index) => (
                    <tr key={turma.id}>
                      <td>{index + 1}</td>
                      <td>{turma.nome}</td>
                      <td>{turma.idadeMinima}</td>
                      <td>{turma.idadeMaxima}</td>
                      <td>{
                        
                        <div>

                          <Link to={`/classes/${turma.id}`}>
                            <button className="w-14 h-10 flex-col" title="EDITAR">
                                <BsPencil className="w-20 h-6 mt-2" color="yellow"/>
                            </button> 
                          </Link>

                        </div>
                      
                      }</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
        
              {/* Paginação */}
              <Pagination className="justify-content-center">
                <Pagination.Prev
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {[...Array(Math.ceil(filteredTurmas.length / itemsPerPage))].map(
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
                  disabled={currentPage === Math.ceil(filteredTurmas.length / itemsPerPage)}
                />
              </Pagination>
            </>
          );

}

export default DataTableTurma;