import { useEffect, useState } from "react";
import Table  from "react-bootstrap/Table";
import { fetchAlunoPorIgreja, fetchAlunos, fetchProfessorAluno } from "../../utils/api";
import Pagination from "react-bootstrap/Pagination";
import { Aluno } from "../../types/aluno";
import { Link } from "react-router-dom";
import { BsFillPlusCircleFill, BsPencil } from "react-icons/bs";
import { formatLocalDate } from "../../utils/format";



function DataTableAluno() {

  const [aluno, setAluno] =  useState<Aluno[]>([])
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
  const igrejaId = sessionStorage.getItem('igrejaId');
  const classeId = sessionStorage.getItem("classeId");

  const carregarAlunos = async () => {
    try {
      let response;
      if (classeId && !isNaN(Number(classeId))) {
        response = await fetchProfessorAluno(Number(classeId));
      } else if (igrejaId && !isNaN(Number(igrejaId))) {
        response = await fetchAlunoPorIgreja(Number(igrejaId));
      } else {
        response = await fetchAlunos();
      }

      setAluno(response.data);

      // 🔹 Se há igreja definida e os alunos possuem área, armazena a área
            if (igrejaId && response.data.length > 0) {
              
              const primeiraArea = response.data[0].area;
              const todasIguais = response.data.every((a: Aluno) => a.area === primeiraArea);
      
              if (todasIguais) {
                sessionStorage.setItem("areaAtual", primeiraArea);
              } else {
                sessionStorage.removeItem("areaAtual");
              }
            }
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
    }
  };

  carregarAlunos();  
}, []);




  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

    
  const lowerSearch = search.toLowerCase();
  const filteredAlunos = aluno.filter((aluno) => aluno.
    nome.toLowerCase().includes(lowerSearch));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAlunos = filteredAlunos.slice(
    indexOfFirstItem,
    indexOfLastItem
  );    



  return (
    <>
      <div className="flex justify-between mb-5 rounded-3xl w-screen p-5">
        <div className="flex justify-start w-screen -mt-12">   
          <input
            className="text-center bg-slate-500 h-8 w-56"
            type="text"
            value={search}
            onChange={event => setSearch(event.target.value)}
          placeholder="digite nome"/>
        </div>

        <a href="/alunos/new/0" className="flex items-center justify-end w-16 h-10
           bg-blue-500 rounded-full" title="NOVO">
            <BsFillPlusCircleFill className="w-32 h-20 text-blue-600"/>
        </a>
      </div>            
      <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th></th>
                    <th>Nome</th>
                    <td>Aniversário</td>
                    <td>Área</td>
                    <td>Novo Convertido</td>
                    <td>Gênero</td>
                    <td>Ação</td>
                  </tr>
                </thead>
                <tbody>
                  {currentAlunos.map((aluno, index) => (
                    <tr key={aluno.id}>
                      <td>{index + 1}</td>
                      <td>{aluno.nome}</td>
                      <td>{ formatLocalDate(aluno.aniversario, 'dd/MM/yyyy')}</td>
                      <td>{aluno.area}</td>
                      <td>{aluno.novoConvertido ? 'SIM' : 'NÃO'}</td>
                      <td>{aluno.sexo}</td>
                      <td>{
                        
                        <div>

                          <Link to={`/alunos/${aluno.id}`}>
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
                {[...Array(Math.ceil(filteredAlunos.length / itemsPerPage))].map(
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
                  disabled={currentPage === Math.ceil(filteredAlunos.length / itemsPerPage)}
                />
      </Pagination>
    </>
  );

}

export default DataTableAluno;