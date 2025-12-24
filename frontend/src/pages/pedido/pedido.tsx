import { useEffect, useState } from "react";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import { Pedido } from "../../types/pedido";
import { BsFillPlusCircleFill, BsPencil } from "react-icons/bs";
import { fetchPedido, fetchPedidoPorIgreja } from "../../utils/api";
import { Button, Modal, Pagination, Table } from "react-bootstrap";
import { formatLocalDate } from "../../utils/format";
import Menu from "../../components/menu/Menu";
import { Revista } from "../../types/revista";


function Pedidos() {
  const [pedido, setPedido] = useState<Pedido[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [selectedRevistas, setSelectedRevistas] = useState<Revista[]>([]);
  


  useEffect(() => {
  const igrejaId = sessionStorage.getItem('igrejaId');
  if (igrejaId && !isNaN(Number(igrejaId))) {
    fetchPedidoPorIgreja(Number(igrejaId))
      .then(response => {
        setPedido(Array.isArray(response.data) ? response.data : []);
      })
      .catch(error => console.log(error));
        } else {
            fetchPedido()
            .then(response => setPedido(Array.isArray(response.data) ? response.data : []))
            .catch(error => console.log(error));
        }
    }, []);


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
    
        
  const lowerSearch = search.toLowerCase();
  const filteredPedidos = pedido.filter((pedido) => pedido.
  nome.toLowerCase().includes(lowerSearch));
    
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPedidos = filteredPedidos.slice(
    indexOfFirstItem,
    indexOfLastItem
  );    

  const handleShowRevistas = (revistas: Revista[]) => {
    if (Array.isArray(revistas)) {
      setSelectedRevistas(revistas);
      //setShowModal(true);
    } else {
      setSelectedRevistas([]);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

    return(
        <>
            <Header/>
            <Menu />
            <div className="p-10 h-screen">
                <div className="flex justify-between rounded-3xl w-screen mb-5">
                    <div className="flex justify-start w-screen -mt-12">   
                        <input
                        className="text-center bg-slate-500 h-8 w-56"
                        type="text"
                        value={search}
                        onChange={event => setSearch(event.target.value)}
                        placeholder="digite nome"
                        />
                    </div>

                    <a href="/pedidos/new/0" className="flex items-center justify-end w-16 h-10 mr-20
                    bg-blue-500 rounded-full" title="NOVO">
                        <BsFillPlusCircleFill className="w-32 h-20 text-blue-600"/>
                    </a>

                </div>

                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                        <th></th>
                        <th>Nome</th>
                        <td>Data do Pedido</td>
                        <td>Entrega Prevista</td>
                        <td>Igreja</td>
                        <td>Descrição</td>
                        <td>Total de Revistas</td>
                        <td>Total do Pedido</td>
                        <td>Situação</td>
                        <td>Revistas</td>
                        <td>Ação</td>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPedidos.map((pedido, index) => {
                        const quantidadeTotalRevistas = Array.isArray(pedido.revistas)
                        ? pedido.revistas.reduce((total, revista) => total + revista.quantidade, 0) : 0;

                        return (
                            <tr key={pedido.id}>
                            <td>{index + 1}</td>
                            <td>{pedido.nome}</td>
                            <td>{formatLocalDate(pedido.dataPedido, "dd/MM/yyyy")}</td>
                            <td>{formatLocalDate(pedido.dataEntregaPrevista, "dd/MM/yyyy")}</td>
                            <td>{pedido.igrejaNome}</td>
                            <td>{pedido.descricao}</td>
                            <td>{quantidadeTotalRevistas}</td>
                            <td>{pedido.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                            <td>{pedido.status}</td>
                            <td style={{ cursor: 'pointer', textAlign: 'center' }}>
                                <span
                                    title="Ver Revistas"
                                    onClick={() => handleShowRevistas(pedido?.revistas || [])}
                                    style={{ color: 'blue', fontWeight: 'bold' }}
                                >
                                    📚
                                </span>
                            </td>
                            <td>
                            <div>
                                <button 
                                    className="w-14 h-10 flex-col" 
                                    title="EDITAR" 
                                    onClick={() => window.location.href = `/pedidos/${pedido.id}`}
                                >
                                    <BsPencil className="w-20 h-6 mt-2" color="yellow" />
                                </button>
                            </div>
                            </td>
                            </tr>
                        );
                        })}
                    </tbody>
                </Table>
            
                {/* Paginação */}
                <div className="flex flex-col text-center">    
                    <Pagination className="justify-content-center">
                    <Pagination.Prev
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    />
                    {[...Array(Math.ceil(filteredPedidos.length / itemsPerPage))].map(
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
                            disabled={currentPage === Math.ceil(filteredPedidos.length / itemsPerPage)}
                            />
                            </Pagination>

                    <div>
                        <Button variant="primary" className='btn-primary mb-3' as="a" href="/home">VOLTAR</Button>
                    </div>

                </div>


            </div>

             {/* Modal de Revistas */}
            <Modal show={showModal} onHide={handleCloseModal} >
                <Modal.Header closeButton>
                <Modal.Title>Lista de Revistas</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <ul>
                    {selectedRevistas.map((revista, index) => (
                    <div key={index} className="w-4/5">
                        <strong>{revista.nome}</strong> - {revista.tipo} - 
                        Quantidade: {revista.quantidade} - Formato: {revista.formato} - 
                        Preço: {revista.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                    ))}
                </ul>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Fechar
                </Button>
                </Modal.Footer>
            </Modal>

            <footer>
                <Footer/>
            </footer>
        
        
        </>
    )
}

export default Pedidos;