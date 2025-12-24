import { useEffect, useState } from "react";
import { Revista } from "../../types/revista";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import { fetchRevistas, fetchRevistasPorIgreja } from "../../utils/api";
import { BsFillPlusCircleFill, BsPencil } from "react-icons/bs";
import { Button, Pagination, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

function Revistas() {

  const [ revista, setRevista] = useState<Revista[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);


  useEffect(() => {
    const igrejaId = sessionStorage.getItem('igrejaId');
      if (igrejaId && !isNaN(Number(igrejaId))){
        fetchRevistasPorIgreja(Number(igrejaId))
          .then(response => setRevista(response.data))
          .catch(error => console.log(error));
        } else {
        fetchRevistas().then(response => setRevista(response.data))
        .catch(error => console.log(error))
      }
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
    
        
  const lowerSearch = search.toLowerCase();
  const filteredRevistas = revista.filter((revista) => revista.
  nome.toLowerCase().includes(lowerSearch));
    
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRevistas = filteredRevistas.slice(
    indexOfFirstItem,
    indexOfLastItem
  );    


  return(
    <>
      <Header/>
      <div className="p-5">  
        <div className="flex justify-between mb-5 rounded-3xl w-screen p-10">
          <div className="flex justify-start w-screen -mt-12">   
            <input
              className="text-center bg-slate-500 h-8 w-56"
              type="text"
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="digite nome"
            />
          </div>

          <a href="/revistas/new/0" className="flex items-center justify-end w-16 h-10 mr-20
           bg-blue-500 rounded-full" title="NOVO">
            <BsFillPlusCircleFill className="w-32 h-20 text-blue-600"/>
          </a>

        </div>

            <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th></th>
                    <th>Nome</th>
                    <td>Formato</td>
                    <td>Tipo</td>
                    <td>Valor</td>
                    <td>Ação</td>
                  </tr>
                </thead>
                <tbody>
                  {currentRevistas.map((revista, index) => (
                    <tr key={revista.id}>
                      <td>{index + 1}</td>
                      <td>{revista.nome}</td>
                      <td>{revista.formato}</td>
                      <td>{revista.tipo}</td>
                      <td>{revista.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                      <td>{
                        
                        <div>

                          <Link to={`/revistas/${revista.id}`}>
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
        <div className="flex flex-col text-center">    
          <Pagination className="justify-content-center">
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {[...Array(Math.ceil(filteredRevistas.length / itemsPerPage))].map(
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
                  disabled={currentPage === Math.ceil(filteredRevistas.length / itemsPerPage)}
                  />
                </Pagination>

          <div>
            <Button variant="primary" className='btn-primary mb-3' as="a" href="/home">VOLTAR</Button>
          </div>
      
        </div>

      </div>  
      <footer className="w-screen">
        <Footer/>
      </footer>
    </>

  )
}

export default Revistas;