import Header from "../../components/header/header.tsx";
import {useEffect, useState} from "react";
import {Parcela} from "../../types/pagamento.ts";
import {fetchPagarParcela, fetchParcelaIgreja, fetchParcelas} from "../../utils/api.ts";
import Table from "react-bootstrap/esm/Table";
import {Button, Pagination} from "react-bootstrap";
import Footer from "../../components/footer/footer.tsx";
import { FaCheck } from "react-icons/fa";
import { formatLocalDate } from '../../utils/format';



function Parcelas() {
    const [parcela, setParcela] = useState<Parcela[]>([])
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    useEffect(() => {
        const igrejaId = sessionStorage.getItem('igrejaId');
        const classeId = sessionStorage.getItem("classeId");

        const carregarParcelas = async () => {
            try {
                if (classeId && !isNaN(Number(classeId))) {
                    const response = await fetchParcelas();
                    setParcela(response.data);
                } else if (igrejaId && !isNaN(Number(igrejaId))) {
                    const response = await fetchParcelaIgreja(Number(igrejaId));
                    setParcela(response.data);
                } else {
                    const response = await fetchParcelas();
                    setParcela(response.data);
                }
            } catch (error) {
                console.error("Erro ao buscar parcelas:", error);
            }
        };

        carregarParcelas();
    }, []);


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const lowerSearch = search.toLowerCase();
    const filteredParcela = parcela.filter((p) =>
        p.status.toLowerCase().includes(lowerSearch)
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentParcelas = filteredParcela.slice(indexOfFirstItem, indexOfLastItem);

    const handlePagarParcela = async (parcelaId: number) => {
        try {
            await fetchPagarParcela(parcelaId); // Chama a API
            setParcela((prev) =>
                prev.map((p) =>
                    p.id === parcelaId ? { ...p, status: "PAGO", dataPagamento: new Date().toISOString().split("T")[0] } : p
                )
            );
        } catch (error) {
            console.error("Erro ao pagar parcela:", error);
        }
    };


    return (
        <>
            <Header/>
            <div className="p-10 h-screen">
                <div className="flex justify-between rounded-3xl w-screen mb-5">
                    <input
                        className="text-center bg-slate-500 h-8 w-56"
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Digite o status do pagamento"
                    />
                </div>

                <Table striped bordered hover variant="dark">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Numero</th>
                        <th>Valor</th>
                        <th>Vencimento</th>
                        <th>Pagamento Realizado (data)</th>
                        <th>Atraso (Dias)</th>
                        <th>Igreja</th>
                        <th>Situação</th>
                        <th>Ação</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentParcelas.map((parcela, index) => (
                        <tr key={parcela.id}>
                            <td>{index + 1}</td>
                            <td>{parcela.numero}</td>
                            <td>{parcela.valor}</td>
                            <td>{formatLocalDate(parcela.dataVencimento, "dd/MM/yyyy")}</td>
                            <td>
                                {parcela.dataPagamento
                                    ? formatLocalDate(parcela.dataPagamento, "dd/MM/yyyy")
                                    : "NÃO EFETUADO"}
                            </td>
                            <td>{parcela.atraso}</td>
                            <td>{parcela.igrejaNome}</td>
                            <td>{parcela.status}</td>
                            <td>
                                <button
                                    className={`px-3 py-1 rounded ${parcela.status === "PAGO" ? "bg-green-500 cursor-not-allowed" : "bg-red-500 text-white"}`}
                                    disabled={parcela.status === "PAGO"}
                                    onClick={() => handlePagarParcela(parcela.id)}
                                >
                                    <FaCheck />
                                </button>
                            </td>
                        </tr>


                    ))}

                    </tbody>
                </Table>

                <Pagination className="justify-content-center">
                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}/>
                    {[...Array(Math.ceil(filteredParcela.length / itemsPerPage))].map((_, index) => (
                        <Pagination.Item
                            key={index}
                            active={index + 1 === currentPage}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)}
                                     disabled={currentPage === Math.ceil(filteredParcela.length / itemsPerPage)}/>
                </Pagination>
                <Button variant="primary" className="btn-primary mb-10" as="a" href="/pagamentos">
                    VOLTAR
                </Button>
            </div>

            <div className="mt-20">
                <Footer/>
            </div>
        </>
    )
}

export default Parcelas;