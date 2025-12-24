import { useEffect, useRef, useState } from "react";
import { fetchAlunoAndAulas } from "../../../utils/api";
import { Button, Table } from "react-bootstrap";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import { Chart, ChartConfiguration } from 'chart.js/auto';

interface Filtro {
    alunoId: number;
    ano: number | null;
    mes: number | null;
    trimestre: number | null;
}

interface Aula {
    id: number;
    licao: string;
    dia: string;
    alunoAulas: { id: number; presente: boolean }[];
}

function AulasPorAluno() {
    const [filtro, setFiltro] = useState<Filtro>({ alunoId: parseInt(sessionStorage.getItem('classeId') || '0'), 
        ano: null, mes: null, trimestre: null });
    const [aulas, setAulas] = useState<Aula[]>([]);
    const [loading, setLoading] = useState(false);
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFiltro({ ...filtro, [e.target.name]: e.target.value ? parseInt(e.target.value) : null });
    };

    const buscarAulas = async () => {
        if (filtro.ano && (filtro.mes || filtro.trimestre)) {
            setLoading(true);
            try {
                const response = await fetchAlunoAndAulas(filtro);
                setAulas(response.data);
            } catch (error) {
                console.error('Erro ao buscar aulas:', error);
            } finally {
                setLoading(false);
            }
        } else {
            alert('Por favor, insira o ano e mês ou trimestre.');
        }
    };

    const isBuscarDisabled = !(
        filtro.ano &&
        (filtro.mes || filtro.trimestre)
    );


    useEffect(() => {
        if (aulas.length > 0 && chartRef.current) {
            const dataPresenca = aulas.map(aula => {
                const alunoAula = aula.alunoAulas.find(alunoAula => alunoAula.presente);
                return alunoAula ? 1 : 0;
            });
            const labels = aulas.map(aula => new Date(aula.dia).toLocaleDateString());
            const config: ChartConfiguration = {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Presença do Aluno',
                            data: dataPresenca,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 1,
                            ticks: {
                                stepSize: 1,
                                callback: function (value) {
                                    return value === 1 ? 'Presente' : 'Ausente';
                                }
                            }
                        }
                    }
                }
            };

            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            chartInstance.current = new Chart(chartRef.current, config);
        }
    }, [aulas]);

    return (
        <>
            <div className="mb-5">
                <Header/>
            </div>

            <div className="p-4 h-screen">
                <h2>Aulas por Aluno</h2>
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label htmlFor="ano" className="form-label">Ano:</label>
                        <input
                            type="number"
                            className="form-control"
                            id="ano"
                            name="ano"
                            value={filtro.ano || ''}
                            onChange={handleFiltroChange}
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="mes" className="form-label">Mês:</label>
                        <select
                            className="form-control"
                            id="mes"
                            name="mes"
                            value={filtro.mes || ''}
                            onChange={handleFiltroChange}
                            disabled={!!filtro.trimestre}
                        >
                            <option value="">Selecione um mês</option>
                            <option value="1">Janeiro</option>
                            <option value="2">Fevereiro</option>
                            <option value="3">Março</option>
                            <option value="4">Abril</option>
                            <option value="5">Maio</option>
                            <option value="6">Junho</option>
                            <option value="7">Julho</option>
                            <option value="8">Agosto</option>
                            <option value="9">Setembro</option>
                            <option value="10">Outubro</option>
                            <option value="11">Novembro</option>
                            <option value="12">Dezembro</option>
                        </select>
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="trimestre" className="form-label">Trimestre:</label>
                        <select
                            className="form-control"
                            id="trimestre"
                            name="trimestre"
                            value={filtro.trimestre || ''}
                            onChange={handleFiltroChange}
                            disabled={!!filtro.mes}
                        >
                            <option value="">Selecione um trimestre</option>
                            <option value="1">1º Trimestre</option>
                            <option value="2">2º Trimestre</option>
                            <option value="3">3º Trimestre</option>
                            <option value="4">4º Trimestre</option>
                        </select>
                    </div>
                </div>

                <Button as="a" href="/home" className="mr-5">VOLTAR</Button>
                
                <Button
                    className="btn btn-primary"
                    onClick={buscarAulas}
                    disabled={loading || isBuscarDisabled}
                >
                    {loading ? 'Carregando...' : 'Buscar Aulas'}
                </Button>


                <h3>Aulas</h3>
                {aulas.length > 0 ? (
                    <>   
                        <Table>
                            <thead>
                                <tr>
                                    <th>Lição</th>
                                    <th>Data</th>
                                   
                                </tr>
                            </thead>
                            <tbody>
                                {aulas.map(aula => (
                                    <tr key={aula.id}>
                                        <td>{aula.licao}</td>
                                        <td>{new Date(aula.dia).toLocaleDateString()}</td>
                                       
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <div className="mb-5 p-5 h-96">
                        <canvas ref={chartRef} /> 
                        </div>
                    </>    
                ) : (
                    <p className="font-bold ">Nenhuma aula encontrada.</p>
                )}
            </div>
            <br />
            <footer>
                <Footer />
            </footer>    
        </>
    );
}

export default AulasPorAluno;