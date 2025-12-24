/* eslint-disable @typescript-eslint/no-unused-vars */
import { SetStateAction, useEffect, useState } from "react";
import { fetchNiver, fetchNiverPorIgreja, fetchNiverTrimestre, fetchNiverTrimestrePOrIgreja } from "../../utils/api";
import { Button, Container, FormControl, Pagination, Table } from "react-bootstrap";

type Aniversariante = {
    id: number;
    nome: string;
    aniversario: string;
    professorAulas?: { id: number }[];
};

function Aniversários() {

    const [aniversariantesMes, setAniversariantesMes] = useState<Aniversariante[]>([]);
    const [aniversariantesTrimestre, setAniversariantesTrimestre] = useState<Aniversariante[]>([]);
    const [selecao, setSelecao] = useState('mes');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);


    useEffect(() => {
        const igrejaId = sessionStorage.getItem('igrejaId');
      if (igrejaId && !isNaN(Number(igrejaId))){
        fetchNiverPorIgreja(Number(igrejaId))
        .then(response => setAniversariantesMes(response.data))
        .catch(error => console.log(error));
        } else {
        fetchNiver().then(response => setAniversariantesMes(response.data))
        .catch(error => console.log(error))
        }
      }, []);

    useEffect(() => {
        const igrejaId = sessionStorage.getItem('igrejaId');
      if (igrejaId && !isNaN(Number(igrejaId))){
        fetchNiverTrimestrePOrIgreja(Number(igrejaId))
        .then(response => setAniversariantesTrimestre(response.data))
        .catch(error => console.log(error));
        } else {
        fetchNiverTrimestre().then(response => setAniversariantesTrimestre(response.data))
        .catch(error => console.log(error))
        }
    }, []);
      
    const handleSearchChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleSelecaoChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setSelecao(event.target.value);
        setCurrentPage(1);
    };
    
    const aniversariantes = selecao === 'mes' ? aniversariantesMes : aniversariantesTrimestre;
    const filteredAniversariantes = aniversariantes.filter(aniversariante =>
        aniversariante.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAniversariantes = filteredAniversariantes.slice(
        indexOfFirstItem,
        indexOfLastItem
    );  

    const totalPages = Math.ceil(filteredAniversariantes.length / itemsPerPage);
    
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };


    return (
        <>
            <Container>
                <div>
                    <h1>Aniversariantes</h1>
                    <div>Escolha mês ou Trimestre</div>
                    <select value={selecao} onChange={handleSelecaoChange} className="mb-3">
                        <option value="mes">Mês</option>
                        <option value="trimestre">Trimestre</option>
                    </select>
                    <FormControl
                    type="text"
                    placeholder="Pesquisar por nome"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="mb-3"
                    />
                    <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                        <th>Nome</th>
                        <th>Aniversário</th>
                        <th>Tipo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentAniversariantes.map(aniversariante => (
                        <tr key={aniversariante.id}>
                            <td>{aniversariante.nome}</td>
                            <td>{new Date(aniversariante.aniversario).toLocaleDateString()}</td>
                            <td>{aniversariante.professorAulas ? 'Professor' : 'Aluno'}</td>
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
                {[...Array(Math.ceil(filteredAniversariantes.length / itemsPerPage))].map(
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
                  disabled={currentPage === Math.ceil(filteredAniversariantes.length / itemsPerPage)}
                />
              </Pagination>
                    <Button variant="primary" className='btn-primary mb-3' as="a" href="/home">VOLTAR</Button>
                </div>

            </Container>
        </>
    )
}

export default Aniversários;