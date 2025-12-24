/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import Table  from "react-bootstrap/Table";
import { Igreja } from "../../types/igreja";
import { fetchIgrejaById, fetchIgrejas } from "../../utils/api";
import Pagination from "react-bootstrap/Pagination";
import { BsFillPlusCircleFill, BsPencil } from "react-icons/bs";
import { Link } from "react-router-dom";
import { MdOutbond } from "react-icons/md";



function DataTableIgreja() {

  const [igreja, setIgreja] =  useState<Igreja[]>([])
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const igrejaId = sessionStorage.getItem('igrejaId');
  



  useEffect(() => {
    const igrejaId = sessionStorage.getItem('igrejaId');
    if (igrejaId && !isNaN(Number(igrejaId))) {
      fetchIgrejaById(Number(igrejaId))
        .then(response => setIgreja([response.data]))
        .catch(error => console.log(error));
    } else {
      fetchIgrejas()
        .then(response => setIgreja(response.data))
        .catch(error => console.log(error));
    }
  }, []);
  
  

  const handlePageChange = (page: number) => {
        setCurrentPage(page);
  };

    
    const lowerSearch = search.toLowerCase();
    const filteredIgrejas = igreja.filter((igreja) => igreja.
        nome.toLowerCase().includes(lowerSearch));

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentIgrejas = filteredIgrejas.slice(
        indexOfFirstItem,
        indexOfLastItem
    );    



    return (
            <>
              <div className="flex justify-between mb-5 rounded-3xl w-screen p-5">
                <div className="flex justify-start w-screen ml-10">  
                  <input
                    className="mr-2 text-center bg-slate-500"
                    type="text"
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    placeholder="digite nome"
                  />
                </div>
                
                {(!igrejaId || igrejaId === 'null') && (
                    <a href="/igrejas/new/0" className="flex items-center w-16 h-10 bg-blue-500 rounded-full mt-5 justify-end" title="NOVO">
                        <BsFillPlusCircleFill className="w-32 h-20 text-blue-600" />
                    </a>
                )}
              </div>
        
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th></th>
                    <th>Nome</th>
                    <th>Endereço</th>
                    <th>Bairro</th>
                    <th>Cidade</th>
                    <th>CEP</th>
                    <th>Área</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {currentIgrejas.map((igreja, index) => (
                    <tr key={igreja.id}>
                      <td>{index + 1}</td>
                      <td>{igreja.nome}</td>
                      <td>{igreja.endereco}</td>
                      <td>{igreja.bairro}</td>
                      <td>{igreja.cidade}</td>
                      <td>{igreja.cep}</td>
                      <td>{igreja.area}</td>
                      <td>{
                        
                        <div>

                          <Link to={`/igrejas/${igreja.id}`}>
                            <button className="w-14 h-10 flex-col" title="EDITAR">
                                <BsPencil className="w-20 h-6 mt-2" color="yellow"/>
                            </button> 
                          </Link>

                          <Link to={`/igrejaEebdEturma/${igreja.id}`}>
                            <button className="w-14 h-10 flex-col" title="Listar ebd e turmas">
                                <MdOutbond className="w-20 h-6 mt-2" color="blue"/>
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
                {[...Array(Math.ceil(filteredIgrejas.length / itemsPerPage))].map(
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
                  disabled={currentPage === Math.ceil(filteredIgrejas.length / itemsPerPage)}
                />
              </Pagination>
            </>
          );

}

export default DataTableIgreja;