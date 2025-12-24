import { useEffect, useState } from "react";
import Table  from "react-bootstrap/Table";
import { fetchProfessores, fetchProfessorPorIgreja } from "../../utils/api";
import Pagination from "react-bootstrap/Pagination";
import { Professor } from "../../types/professor";
import { formatLocalDate } from "../../utils/format";
import { BsFillPlusCircleFill, BsPencil } from "react-icons/bs";
import { Link } from "react-router-dom";



function DataTableProfessor() {

    const [professor, setProfessor] =  useState<Professor[]>([])
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
      const igrejaId = sessionStorage.getItem('igrejaId');
      if (igrejaId && !isNaN(Number(igrejaId))){
      fetchProfessorPorIgreja(Number(igrejaId))
        .then(response => setProfessor(response.data))
        .catch(error => console.log(error));
      } else {
        fetchProfessores().then(response => setProfessor(response.data))
        .catch(error => console.log(error))
      }
      }, []);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
      };

    
    const lowerSearch = search.toLowerCase();
    const filteredProfessores = professor.filter((professor) => professor.
        nome.toLowerCase().includes(lowerSearch));

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProfessores = filteredProfessores.slice(
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

                <a href="/professores/new/0" className="flex items-center justify-center w-16 h-10 bg-blue-500 rounded-full mt-5" title="NOVO">
                  <BsFillPlusCircleFill className="w-32 h-20 text-blue-600"/>
                </a>

              </div>
        
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th></th>
                    <th>Nome</th>
                    <th>Aniversário</th>
                    <td>Ação</td>
                  </tr>
                </thead>
                <tbody>
                  {currentProfessores.map((professor, index) => (
                    <tr key={professor.id}>
                      <td>{index + 1}</td>
                      <td>{professor.nome}</td>
                      <td>{formatLocalDate(professor.aniversario, 'dd/MM/yyyy')}</td>
                      <td>{
                        
                        <div>

                          <Link to={`/professores/${professor.id}`}>
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
                {[...Array(Math.ceil(filteredProfessores.length / itemsPerPage))].map(
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
                  disabled={currentPage === Math.ceil(filteredProfessores.length / itemsPerPage)}
                />
              </Pagination>
            </>
          );

}

export default DataTableProfessor;