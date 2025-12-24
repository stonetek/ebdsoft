/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Aluno } from "../../../types/aluno";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../components/header/header";
import { BiSend } from "react-icons/bi";
import { Button, Table } from "react-bootstrap";
import { fetchAlunosElegiveis, fetchIgrejaAndEbd, fetchIgrejas, fetchTurmasPorEbd } from "../../../utils/api";
import { EbdTurmas } from "../../../types/ebdTurmas";
import { Igreja } from "../../../types/igreja";
import { IgrejaEbd } from "../../../types/igrejaEbd";
import Footer from "../../../components/footer/footer";



function NewAlunoTurma() {
    const [igrejas, setIgrejas] = useState<Igreja[]>([]);
    const [selectedIgrejaId, setSelectedIgrejaId] = useState<string | null>(null);
    const [ebds, setEbds] = useState<IgrejaEbd[]>([]);
    const [idEbd, setIdEbd] = useState<string | null>(null);
    const [selectedEbdId, setSelectedEbdId] = useState<string | null>(null);
    const [turmas, setTurmas] = useState<EbdTurmas[]>([]);
    const [idTurma, setIdTurma] = useState<string | null>(null);
    const [selectedTurmaId, setSelectedTurmaId] = useState<number | null>(null);
    const [alunoId, setAlunoId] = useState<string | null>(null);
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [sexoFilter, setSexoFilter] = useState<string | null>(null);
    const [novoConvertidoFilter, setNovoConvertidoFilter] = useState<boolean | null>(null);
    const { alunoTurmaID } = useParams();
    const acessToken = sessionStorage.getItem('accessToken');
    const history = useNavigate();

    useEffect(() => {
        loadIgrejas();
    }, []);

    const loadIgrejas = async () => {
        try {
            const response = await fetchIgrejas();
            setIgrejas(response.data);
        } catch (error) {
            console.error('Error fetching igrejas:', error);
        }
    };

    const handleIgrejaChange = async (e: { target: { value: any; }; }) => {
        const idIgreja = e.target.value;
        setSelectedIgrejaId(idIgreja);
        setIdEbd(null);
        setIdTurma(null);
        setAlunoId(null);
        setEbds([]);
        setAlunos([]);
    
        try {
            const response = await fetchIgrejaAndEbd(idIgreja);
            setEbds(response.data); 
        } catch (error) {
            console.error('Error fetching EBDs:', error);
        }
    };
    

    const handleEbdChange = async (e: { target: { value: any; }; }) => {
        const idEbd = e.target.value;
        setSelectedEbdId(idEbd);
        setIdTurma(null);
        setAlunoId(null);
        setAlunos([]);
        try {
            const response = await fetchTurmasPorEbd(idEbd);
            setTurmas(response.data);
        }catch (error) {
            console.error('Error fetching Turmas:', error);
        }
    };

    const handleTurmaChange = async (e: { target: { value: any; }; }) => {
        const idTurma = Number(e.target.value);
        setSelectedTurmaId(idTurma);
        setAlunos([]);
        try {
            const response = await fetchAlunosElegiveis(idTurma);
            const updatedAlunos = response.data.map((aluno: any) => ({
                ...aluno,
                matriculado: aluno.matriculado || (aluno.turmas && aluno.turmas.includes(idTurma)) // Handle both cases
            }));
            setAlunos(updatedAlunos);
        } catch (error) {
            console.error('Error fetching alunos:', error);
        }
    };
    

    const filteredAlunos = alunos.filter(aluno => {
        if (sexoFilter && aluno.sexo !== sexoFilter) return false;
        if (novoConvertidoFilter !== null && aluno.novoConvertido !== novoConvertidoFilter) return false;
        return true;
    });

    const handleCheckboxChange = (alunoId: number, isChecked : boolean) => {
        setAlunos((prevAlunos: Aluno[]) =>
            prevAlunos.map((aluno: Aluno) =>
                aluno.id === alunoId ? { ...aluno, matriculado: isChecked  } : aluno
            )
        );
    };
    
    async function saveOrUpdate(e: { preventDefault: () => void; }) {
        e.preventDefault();
        const alunosToUpdate = alunos
            .filter(aluno => aluno.matriculado)  // Filtrar apenas os alunos selecionados
            .map(aluno => aluno.id);             // Obter apenas os IDs dos alunos
        
        const payload = {
            alunoIds: alunosToUpdate,  // Lista de IDs de alunos
            turmaId: selectedTurmaId   // ID da turma
        };
        console.log('Payload a ser enviado para /alunos/aluno-turma-vinculo:', payload);
        try {
            if (alunosToUpdate.length > 0) {
                const response = await fetch('http://localhost:8090/api/alunos/aluno-turma-vinculo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization' : `Bearer ${acessToken}`
                    },
                    body: JSON.stringify(payload) // Enviar o payload no corpo da requisição
                });
                
                if (!response.ok) {
                    throw new Error('Failed to save data');
                }
                
                history('/alunosEturmas');  // Redirecionar após o sucesso
            }
        } catch (error) {
            alert('Error while recording AlunoTurma. Try again!');
            console.error('Error details:', error);
        }
    }
    

    

    return (
        <>
            <Header />
            <div className="w-screen h-screen bg-gradient-to-t from-slate-700 flex flex-col justify-center items-center">
                <h1 className="text-5xl mt-40 mb-40">{alunoTurmaID === '0' ? 'Add' : 'Update'} AlunoTurma</h1>
                <form onSubmit={saveOrUpdate} className="bg-gradient-to-t from-zinc-300 w-3/6 h-3/4 flex flex-col items-center justify-center gap-3">
                    {/* Select para Igrejas */}
                    <label htmlFor="igreja" className="text-2xl text-rose-800">Selecione a Igreja</label>
                    <select 
                        id="igreja" 
                        value={selectedIgrejaId || ''} 
                        onChange={handleIgrejaChange}
                        className="w-60 text-black bg-red-400"
                    >
                        <option value="">Selecione uma igreja</option>
                        {igrejas.map((igreja) => (
                            <option key={igreja.id} value={igreja.id}>{igreja.nome}</option>
                        ))}
                    </select>

                    {/* Seletor de EBD */}
                    <label htmlFor="EbdSelect" className="text-2xl text-rose-800">EBD</label>
                    <select
                        id="EbdSelect"
                        value={selectedEbdId || ''}
                        onChange={handleEbdChange}
                        className="w-60 text-black bg-red-400"
                        disabled={!selectedIgrejaId}
                    >
                        <option value="">Selecione uma EBD</option>
                        {ebds && ebds.length > 0 && ebds.map(ebd => (
                            <option key={ebd.ebdId} value={ebd.ebdId}>{ebd.nomeEbd}</option>
                        ))}
                    </select>

                    {/* Seletor de Turma baseado na EBD selecionada */}
                    <label htmlFor="NomeTurma" className="text-2xl text-rose-800">Nome Turma</label>
                    <select
                        id="NomeTurma"
                        value={selectedTurmaId || ''}
                        onChange={handleTurmaChange}
                        className="w-60 text-black bg-red-400"
                        disabled={!selectedEbdId}
                    >
                        <option value="">Selecione uma turma</option>
                        {turmas && turmas.length > 0 && turmas.map(turma => (
                            <option key={turma.idTurma} value={turma.idTurma}>{turma.nomeTurma}</option>
                        ))}
                    </select>

                    <div className="flex-col">

                        {/* Radio buttons para filtrar por sexo */}
                        <div className="flex gap-5">
                            <label className="text-2xl text-rose-800">Gênero:</label>
                            
                            <div className="ml-24">
                            
                                <label>
                                    <input
                                        type="radio"
                                        value="M"
                                        checked={sexoFilter === 'M'}
                                        onChange={() => setSexoFilter('M')}
                                    />
                                    Masculino
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="F"
                                        checked={sexoFilter === 'F'}
                                        onChange={() => setSexoFilter('F')}
                                        className=" ml-3"
                                    />
                                    Feminino
                                </label>

                            </div>
                        </div>

                        {/* Radio buttons para filtrar por novo convertido */}
                        <div className="flex gap-5">
                            <label className="text-2xl text-rose-800">Novo Convertido:</label>
                            <label>
                                <input
                                    type="radio"
                                    value="true"
                                    checked={novoConvertidoFilter === true}
                                    onChange={() => setNovoConvertidoFilter(true)}
                                    className="-ml-1"
                                />
                                Sim
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="false"
                                    checked={novoConvertidoFilter === false}
                                    onChange={() => setNovoConvertidoFilter(false)}
                                    className="ml-2"
                                />
                                Não
                            </label>
                        </div>

                    </div>

                    <Table striped bordered hover variant="dark">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border">Nome do Aluno</th>
                                <th className="py-2 px-4 border">Matriculado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAlunos.length > 0 ? (
                                filteredAlunos.map(aluno => (
                                    <tr key={aluno.id}>
                                        <td className="py-2 px-4 border">{aluno.nome}</td>
                                        <td className="py-2 px-4 border">
                                            {aluno.matriculado ? (
                                                <div>
                                                    <span>SIM</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={true}
                                                        disabled
                                                    />
                                                </div>
                                            ) : (
                                                <div>
                                                    <span>{aluno.matriculado ? 'SIM' : 'NÃO'}</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={aluno.matriculado || false}
                                                        onChange={(e) => handleCheckboxChange(aluno.id, e.target.checked)}
                                                    />
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className="text-center">Nenhum aluno encontrado</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>

                    <div className="flex text-center gap-5">
                        <button type="submit" className="w-20 h-32 flex items-center justify-center -mt-24">
                            {alunoTurmaID === '0' ? 'Add' : 'Update'}
                            <BiSend title={alunoTurmaID === '0' ? 'Add' : 'Update'} color="green" className="w-20 h-20" />
                        </button>
                        <Button as="a" href="/alunosEturmas" className="-mt-24">VOLTAR</Button>
                    </div>        
                </form>
            <footer className="w-screen mt-10">
                <Footer/>
            </footer>
            </div>

        </>
    );
}

export default NewAlunoTurma;