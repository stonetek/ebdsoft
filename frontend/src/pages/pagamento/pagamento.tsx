/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState} from "react";
import { Button, Table, Pagination } from "react-bootstrap";
import { BsQrCode, BsFillPlusCircleFill } from "react-icons/bs";
import { Pagamento, parcelasSet} from "../../types/pagamento";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import { formatLocalDate } from "../../utils/format";
//import api from "../../service/api";
import { fetchPagamentoPorIgreja, fetchPagamentos } from "../../utils/api";
import CODE from "../../../public/image/qrcode1.jpg"
import Menu from "../../components/menu/Menu.tsx";

function Pagamentos() {
    const [pagamento, setPagamento] = useState<Pagamento[]>([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(3);
    const [showModal, setShowModal] = useState(false);
    const [selectedParcela, setSelectedParcela] = useState<parcelasSet | null>(null);
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const nomePerfil = sessionStorage.getItem("nomePerfil");

    useEffect(() => {
        let isMounted = true;
        const igrejaId = sessionStorage.getItem('igrejaId');
        console.log
        const fetchData = async () => {
            try {
                let response;
                if (igrejaId && !isNaN(Number(igrejaId))) {
                    response = await fetchPagamentoPorIgreja(Number(igrejaId));
                } else {
                    response = await fetchPagamentos();
                }

                if (isMounted && response.data) {
                    const pagamentosData = response.data.map((pagamento: Pagamento) => ({
                        ...pagamento,
                        parcelasSet: pagamento.parcelasSet.map((parcela) => ({
                            ...parcela,
                        })),
                    }));

                    setPagamento(pagamentosData);
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Erro ao buscar pagamentos:", error);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const lowerSearch = search.toLowerCase();
    const filteredPagamento = pagamento.filter((p) =>
        p.status.toLowerCase().includes(lowerSearch)
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPagamentos = filteredPagamento.slice(indexOfFirstItem, indexOfLastItem);
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const handleQrCode = async (pagamento: Pagamento, parcela: parcelasSet) => {
        try {
            // URL da imagem do QR code armazenada na pasta public/images
            <img src={CODE} alt="Avatar" className="w-10 h-10 rounded-full mr-2" />
    
            // Fetch the QR code image
            const response = await fetch(CODE);
            const blob = await response.blob();
            const qrCodeUrl = URL.createObjectURL(blob);
    
            // Atualiza o estado
            setSelectedParcela(parcela);
            setQrCodeUrl(qrCodeUrl);
            setShowModal(true);
        } catch (error) {
            console.error("Erro ao buscar o QR Code:", error);
            alert("Erro ao buscar o QR Code. Verifique a URL e tente novamente.");
        }
    };
    
    
    // Limpar URL para evitar vazamento de memória
    useEffect(() => {
        return () => {
            if (qrCodeUrl) {
                URL.revokeObjectURL(qrCodeUrl);
            }
        };
    }, [qrCodeUrl]);

    function calcularAtraso(dataVencimento: string, dataPagamento: string | null): number {
        if (dataPagamento) return 0;
        const hoje = new Date();
        const vencimento = new Date(dataVencimento);
        const diff = hoje.getTime() - vencimento.getTime();
        const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
        return dias > 0 ? dias : 0;
    }
    

    return (
        <>
            <Header />
            {nomePerfil !== "admin_igreja" && <Menu />}
            <div className="p-10 h-screen">
                <div className="flex justify-between rounded-3xl w-screen mb-5">
                    <input
                        className="text-center bg-slate-500 h-8 w-56"
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Digite o status do pagamento"
                    />

                    <a
                        href="/pedidos/new/0"
                        className="flex items-center justify-end w-16 h-10 mr-20 bg-blue-500 rounded-full"
                        title="NOVO PEDIDO"
                    >
                        <BsFillPlusCircleFill className="w-32 h-20 text-blue-600" />
                    </a>
                </div>

                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Parcelas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPagamentos.map((pagamento, index) => (
                            <tr key={pagamento.id}>
                                <td>{index + 1}</td>
                                <td>{pagamento.valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                                <td>{pagamento.status}</td>
                                <td className="flex gap-10 p-3">
                                    {pagamento.parcelasSet.map((parcela) => {
                                        const atraso = calcularAtraso(parcela.dataVencimento, parcela.dataPagamento);
                                        const statusColor =
                                            String(parcela.status) === "PAGO"
                                                ? "text-green-500"
                                                : atraso > 0
                                                ? "text-red-500"
                                                : "text-blue-500"; // A VENCER
                                        const isPago = String(parcela.status) === "PAGO";

                                        return (
                                            <div key={parcela.id} className="mb-2">
                                                <div>
                                                    Parcela {parcela.numero}:{" "}
                                                    {parcela.valor.toLocaleString("pt-BR", {
                                                        style: "currency",
                                                        currency: "BRL",
                                                    })}
                                                    <br />
                                                    Vencimento: {formatLocalDate(parcela.dataVencimento, "dd/MM/yyyy")}
                                                    <br />
                                                    {parcela.dataPagamento ? (
                                                        <span>Pago</span>
                                                    ) : atraso > 0 ? (
                                                        <span>Atraso: {atraso} dias</span>
                                                    ) : (
                                                        <span>A Vencer</span>
                                                    )}
                                                    <br />
                                                    <span className={`font-bold ${statusColor}`}>Situação: {parcela.status}</span>
                                                </div>
                                                {!parcela.dataPagamento && (
                                                    <Button
                                                        onClick={() => handleQrCode(pagamento, parcela)}
                                                        title="Gerar QR Code"
                                                        style={{ color: "red" }}
                                                        disabled={isPago}
                                                    >
                                                        <BsQrCode />
                                                    </Button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </Table>


                <Pagination className="justify-content-center">
                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                    {[...Array(Math.ceil(filteredPagamento.length / itemsPerPage))].map((_, index) => (
                        <Pagination.Item
                            key={index}
                            active={index + 1 === currentPage}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === Math.ceil(filteredPagamento.length / itemsPerPage)} />
                </Pagination>
                <Button variant="primary" className="btn-primary mb-10" as="a" href="/pedidos">
                    VOLTAR
                </Button>

                <div className="flex text-center">

                    {showModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="bg-white p-5 rounded-lg shadow-lg text-center gap-5">
                                <h2 className="text-xl font-bold mb-4">QR Code - Parcela {selectedParcela?.numero}</h2>
                                <p className="text-lg mb-4">
                                    Valor: {selectedParcela?.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </p>
                                {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code de Pagamento" className="w-48 h-48 mx-auto" />}
                                <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded" onClick={() => setShowModal(false)}>
                                    Fechar
                                </button>
                            </div>
                        </div>
                    )}


                </div>
            </div>
        
            <div className="mt-20">
                <Footer />
            </div>
        </>
    );
}

export default Pagamentos;