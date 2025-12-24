/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import Table  from "react-bootstrap/Table";
import { fetchEbds } from "../../utils/api";
import Pagination from "react-bootstrap/Pagination";
import { Ebd } from "../../types/ebd";
import { BsFillPlusCircleFill, BsPencil } from "react-icons/bs";
import { Link } from "react-router-dom";


function DataTableEbd() {

  const [ebd, setEbd] =  useState<Ebd[]>([])
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [anoSearch, setAnoSearch] = useState('');

  useEffect(() => {
      fetchEbds().then(response => setEbd(response.data))
      .catch(error => console.log(error))
  }, []);

  const handlePageChange = (page: number) => {
      setCurrentPage(page);
  };

  
  const lowerSearch = search.toLowerCase();
    const filteredEbds = ebd.filter(ebd => (
      ebd.nome.toLowerCase().includes(lowerSearch)
  ));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEbds = filteredEbds.slice(
      indexOfFirstItem,
      indexOfLastItem
  );    

  return (
    <>
            
      <div className="flex justify-between mb-2 rounded-3xl w-screen p-5 -mt-16">
              <div className="flex justify-start w-screen -mt-12">  
                <input
                  className="mr-2 text-center bg-slate-500"
                  type="text"
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                  placeholder="digite nome"
                />
              </div>

              <a href="/escolabiblica/new/0" className="flex items-center 
              justify-center w-16 h-10 bg-blue-500 rounded-full" title="NOVO">
                <BsFillPlusCircleFill className="w-32 h-20 text-blue-600"/>
              </a>
              
      </div>
      
      <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th></th>
                  <th>Nome</th>
                  <th>Coordenador</th>
                  <th>ViceCoordenador</th>
                  <th>Presbitero</th>
                  <td>Ação</td>
                </tr>
              </thead>
              <tbody>
                {currentEbds.map((ebd, index) => (
                  <tr key={ebd.id}>
                    <td>{index + 1}</td>
                    <td>{ebd.nome}</td>
                    <td>{ebd.coordenador}</td>
                    <td>{ebd.viceCoordenador}</td>
                    <td>{ebd.presbitero}</td>
                    <td>{
                      
                      <div>

                        <Link to={`/escolabiblica/${ebd.id}`}>
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
              {[...Array(Math.ceil(filteredEbds.length / itemsPerPage))].map(
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
                disabled={currentPage === Math.ceil(filteredEbds.length / itemsPerPage)}
              />
      </Pagination>
    </>
  );

}

export default DataTableEbd;