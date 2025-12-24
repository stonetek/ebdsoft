/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { IgrejaEbd } from "../../../types/igrejaEbd";
import { fetchIgrejaEbd, fetchIgrejaEbdVinculo } from "../../../utils/api";
import { Link } from "react-router-dom";
import { BsFillPlusCircleFill, BsPencil } from "react-icons/bs";
import Header from "../../../components/header/header";
import { Button, Pagination } from "react-bootstrap";

function IgrejaAndEbd() {
  const [igrejaEbd, setIgrejaEbd] = useState<IgrejaEbd[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [idIgreja, setIdIgreja] = useState<number | null>(null);
  
  
  useEffect(() => { 
    const storedIgrejaId = sessionStorage.getItem('igrejaId');
    //console.log('Stored Igreja ID:', storedIgrejaId);
  
    if (storedIgrejaId && storedIgrejaId !== 'null') {
      const idIgrejaNumber = Number(storedIgrejaId);
      setIdIgreja(idIgrejaNumber);
      
      fetchIgrejaEbdVinculo(idIgrejaNumber)
        .then(response => {
          //console.log('Response from fetchIgrejaEbdVinculo:', response.data);
          setIgrejaEbd([response.data]); // Atualizando como array com os dados
        })
        .catch(error => console.log(error));
    } else {
      fetchIgrejaEbd()
        .then(response => {
          console.log('Response from fetchIgrejaEbd:', response.data);
          setIgrejaEbd(response.data);
        })
        .catch(error => console.log(error));
    }
  }, []);
  
  
  
  
  const handlePageChange = (page: number) => {
          setCurrentPage(page);
  };

  
  
  const lowerSearch = search.toLowerCase();
  const filteredIgrejaEbds = Array.isArray(igrejaEbd) ? igrejaEbd.filter((igreja) => 
    igreja.nomeIgreja.toLowerCase().includes(lowerSearch)
  ) : [];
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentIgrejaEbds = filteredIgrejaEbds.length > 0 ? filteredIgrejaEbds.slice(
    indexOfFirstItem,
    indexOfLastItem
  ) : filteredIgrejaEbds;
  
  
  return (
    <>
      <Header/>
              <div className="container mx-auto px-4 mt-6 w-screen h-screen">
                <div className="flex justify-between items-center mt-5">  
                  <h2 className="text-2xl font-bold mb-4">Vínculo Igreja Ebd</h2>
                  <a href="/igrejaEebd/new/0" className="flex items-center justify-center w-16 h-10 bg-blue-500 rounded-full ml-48" title="NOVO">
                    <BsFillPlusCircleFill className="w-20 h-16 text-blue-600"/>
                  </a>
                </div>  

                <div className="flex justify-start w-screen -mt-12">   
                  <input
                    className="text-center border-b border-gray-200 bg-gray-100 h-8 w-56 mb-5"
                    type="text"
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    placeholder="Nome Igreja"
                  />
                </div>
  
                {/* Tabela */}
                  <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto relative">
                      <table className="border-collapse table-auto w-full whitespace-no-wrap bg-white table-striped relative">
                          <thead>
                              <tr className="text-left">
                                  <th className="py-2 px-3 sticky top-0 border-b border-gray-200 bg-gray-100"></th>
                                  <th className="py-2 px-3 sticky top-0 border-b border-gray-200 bg-gray-100">Nome da Igreja</th>
                                  <th className="py-2 px-3 sticky top-0 border-b border-gray-200 bg-gray-100">Nome EBD </th>
                                  <th className="py-2 px-3 sticky top-0 border-b border-gray-200 bg-gray-100">Ação</th>
                              </tr>
                          </thead>
                          <tbody>
                              {currentIgrejaEbds.map((item, index) => (
                                  <tr key={item.id} className="border-b border-gray-200">
                                      <td className="flex justify-center p-2">{index + 1}</td>
                                      <td className="py-2 px-3">{item.nomeIgreja}</td>
                                      <td className="py-2 px-3">{item.nomeEbd}</td>
                                      <td>
                                          <div>
                                              <Link to={`/igrejaEebd/${item.id}`}>
                                                  <button className="w-14 h-10 flex-col" title="EDITAR">
                                                      <BsPencil className="w-20 h-6 mt-2" color="green"/>
                                                  </button>
                                              </Link>
                                          </div>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                      <Pagination className="justify-content-center mt-4">
                      <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      />
                      {[...Array(Math.ceil(filteredIgrejaEbds.length / itemsPerPage))].map(
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
                      disabled={currentPage === Math.ceil(filteredIgrejaEbds.length / itemsPerPage)}
                      />
                </Pagination>
                  </div>
                  <Button as="a" href="/igrejas" className="mt-2">VOLTAR</Button>
              </div>
    </>
  )
}

export default IgrejaAndEbd;