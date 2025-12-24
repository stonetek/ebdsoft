/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { SetStateAction, useEffect, useState } from "react";
import { BiSend } from "react-icons/bi";
import { useParams, useNavigate} from "react-router-dom";
import api from '../../../service/api'
import Header from "../../../components/header/header";
import { Aluno } from "../../../types/aluno";
import { Turma } from "../../../types/turma";
import { fetchTurmas, fetchTurmasPorIgreja } from "../../../utils/api";
import Footer from "../../../components/footer/footer";
import { Professor } from "../../../types/professor";
import { Button } from "react-bootstrap";



function NewAula() {
    const [id, setId] = useState(null);
    const [trimestre, setTrimestre] = useState('');
    const [dia, setDia] = useState('');
    const [licao, setLicao] = useState('');
    const [alunosMatriculados, setAlunosMatriculados] = useState('');
    const [visitantes, setVisitantes] = useState('');
    const [presentes, setPresentes] = useState('');
    const [ausentes, setAusentes] = useState('');
    const [totalAssistencia, setTotalAssistencia] = useState('');
    const [biblias, setBiblias] = useState('');
    const [revistas, setRevistas] = useState('');
    const [oferta, setOferta] = useState('');
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [turmaSelecionada, setTurmaSelecionada] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [professores, setProfessores] = useState<Professor[]>([]);
    const [professorSelecionado, setProfessorSelecionado] = useState<{ id: number; nome: string } | null>(null);

    const { aulaID } = useParams();
    const navigate = useNavigate();

    async function loadAula() {
        try {
            const response = await api.get(`/api/aulas/${aulaID}`);
            const adjustedDate = response.data.dia.split("T", 10)[0];
            setId(response.data.id);
            setTrimestre(response.data.trimestre);
            setDia(adjustedDate);
            setLicao(response.data.licao);
            const professorAula = response.data.professorAulas[0];
                if (professorAula) {
            setProfessorSelecionado({ id: professorAula.idProfessor, nome: professorAula.nomeProfessor });
            } else {
                setProfessorSelecionado(null);
            }
            setAlunosMatriculados(response.data.alunosMatriculados);
            setVisitantes(response.data.visitantes);
            setPresentes(response.data.presentes);
            setAusentes(response.data.ausentes);
            setTotalAssistencia(response.data.totalAssistencia);
            setBiblias(response.data.biblias);
            setRevistas(response.data.revistas);
            setOferta(response.data.oferta);
            setAlunos(response.data.alunoAulas.map((aa: { idAluno: any; nomeAluno: any; presente: any; }) => ({
                id: aa.idAluno,
                nome: aa.nomeAluno,
                presente: aa.presente
            })));
            setTurmas(response.data.aulaTurmas.map((at: { idTurma: any; nomeTurma: any; }) => ({
                id: at.idTurma,
                nome: at.nomeTurma,
            })));
            setTurmaSelecionada(response.data.aulaTurmas[0]?.idTurma || '');
            setIsEditMode(true);
            //console.log("DADOS", response.data)
        } catch (error) {
            alert('Error recovering aula. Try again!');
            navigate('/aulas');
        }
    }

    useEffect(() => {
        if (aulaID === '0') return;
        else loadAula();
    }, [aulaID])

    useEffect(() => {
        const igrejaId = sessionStorage.getItem('igrejaId');
        if (igrejaId && !isNaN(Number(igrejaId))) {
        fetchTurmasPorIgreja(Number(igrejaId))
        .then(response => {
          setTurmas(response.data);
        })
        .catch(error => console.log(error));
        } else {
            fetchTurmas().then(response => setTurmas(response.data))
            .catch(error => console.log(error))
        }
    }, []);


    async function loadAlunosByTurma(turmaId: any) {
        try {
            const response = await api.get(`/api/alunos/turma/${turmaId}`);
            const alunosMatriculados = response.data.length;
            setAlunos(response.data.map((aluno: { id: any; nome: any; }) => ({
                id: aluno.id,
                nome: aluno.nome,
                presente: false
            })));
            setAlunosMatriculados(alunosMatriculados.toString());

            const responseProfessores = await api.get(`/api/professores/turma/${turmaId}`);
            setProfessores(responseProfessores.data);
        } catch (error) {
            alert('Error recovering students. Try again!');
        }
    }

    async function saveOrUpdate(e: { preventDefault: () => void; }) {
        e.preventDefault();

        const alunoAulas = alunos.map(aluno => ({
            idAluno: aluno.id,
            presente: aluno.presente
        }));

        const aulaTurmas = turmaSelecionada ? [{
            idTurma: turmaSelecionada, // Apenas a turma selecionada
            nomeTurma: turmas.find(turma => turma.id === Number(turmaSelecionada))?.nome
        }] : [];

        const data = {
            licao,
            dia,
            alunosMatriculados,
            trimestre,
            ausentes,
            presentes,
            visitantes,
            totalAssistencia,
            biblias,
            revistas,
            oferta,
            professorAulas: [
                {
                    idProfessor: professorSelecionado?.id || null,  // O id do professor selecionado
                },
            ],
            alunoAulas,
            aulaTurmas,
            id: aulaID !== '0' ? id : undefined,
        };

        try {
            if (aulaID === '0') {
                await api.post('/api/aulas', data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                data.id = id;
                await api.put(`/api/aulas/${aulaID}`, data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
            navigate('/aulas');
        } catch (error) {
            alert('Error while recording aula. Try again!');
        }
    }

    useEffect(() => {
        const calculateTotal = () => {
            const totalAssistencia =
                (parseInt(presentes) || 0) +
                (parseInt(visitantes) || 0);
            setTotalAssistencia(totalAssistencia.toString());
        };

        calculateTotal();
    }, [presentes, visitantes]);

    useEffect(() => {
        const calculateTotal1 = () => {
            const total =
                (parseInt(alunosMatriculados) || 0) -
                (parseInt(presentes) || 0);
            setAusentes(total.toString());
        };

        calculateTotal1();
    }, [alunosMatriculados, presentes]);

    const handleDateChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setDia(e.target.value);
    };

    const handlePresenceChange = (idAluno: number, presente: boolean) => {
        setAlunos(alunos.map(aluno =>
            aluno.id === idAluno ? { ...aluno, presente } : aluno
        ));
    };

    const handleSelectChange = (event: { target: { value: any; }; }) => {
        const turmaId = event.target.value;
        setTurmaSelecionada(turmaId);
        loadAlunosByTurma(turmaId);
    };

    return (
        <>
            <Header />
            <div className="flex flex-col items-center mt-4">
                  
                <div className="w-full bg-gradient-to-t from-slate-700 flex flex-col justify-center items-center mt-2">
                    <h1 className="text-5xl mb-10">{aulaID === '0' ? 'Add ' : 'Update '}Aula</h1>
                    <div className="w-screen flex flex-col items-center">
                        <div className="flex gap-64">    
                            <div className="w-1/4 p-4">
                                <h2 className="text-gray-900 text-center mb-4 font-bold text-xl">Turmas</h2>
                                {isEditMode ? (
                                    <p>{turmas.find(t => t.id === Number(turmaSelecionada))?.nome}</p>
                                ) : (
                                    <select value={turmaSelecionada} onChange={handleSelectChange} className="border-2 border-gray-300 p-2 rounded-lg">
                                        <option value="">Selecione uma Turma</option>
                                        {turmas.map((turma) => (
                                            <option key={turma.id} value={turma.id}>{turma.nome}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            <div className="w-1/4 p-4">
                                <h2 className="text-gray-900 text-center mb-4 font-bold text-xl">Alunos</h2>
                                {alunos.map(aluno => (
                                    <div key={aluno.id} className="flex items-center mb-2">
                                        <label className="mr-2">{aluno.nome}</label>
                                        {isEditMode ? (
                                            <input
                                                type="checkbox"
                                                checked={aluno.presente || false}
                                                readOnly
                                            />
                                        ) : (
                                            <input
                                                type="checkbox"
                                                checked={aluno.presente || false}
                                                onChange={e => handlePresenceChange(aluno.id, e.target.checked)}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>     
                        <form
                            key={aulaID}
                            onSubmit={saveOrUpdate}
                            className="bg-gradient-to-t from-zinc-300 w-full p-6 rounded-5 mb-5"
                            style={{ maxWidth: '600px' }}
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 grid grid-cols-2 gap-4 text-center">
                                    <label htmlFor="Trimestre" className="font-bold text-lg">Trimestre</label>
                                    <select
                                        id="Trimestre"
                                        className="border-2 border-gray-300 p-2 rounded-lg w-full"
                                        value={trimestre}
                                        onChange={(e) => setTrimestre(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>Selecione o Trimestre</option>
                                        <option value="1º Trimestre">1º Trimestre</option>
                                        <option value="2º Trimestre">2º Trimestre</option>
                                        <option value="3º Trimestre">3º Trimestre</option>
                                        <option value="4º Trimestre">4º Trimestre</option>
                                    </select>
                                </div>
                                <div className="col-span-2 grid grid-cols-2 gap-20 text-center">
                                    <label htmlFor="Dia" className="font-bold text-lg">Dia</label>
                                    <input
                                        id="Dia"
                                        className="border-2 border-gray-300 p-2 rounded-lg w-full"
                                        type="date"
                                        placeholder="Dia"
                                        value={dia}
                                        onChange={handleDateChange}
                                        required
                                    />
                                </div>
                                <div className="col-span-2 grid grid-cols-2 gap-16 text-center">
                                    <label htmlFor="Licao" className="font-bold text-lg">Lição</label>
                                    <input
                                        id="Licao"
                                        className="border-2 border-gray-300 p-2 rounded-lg w-full"
                                        type="text"
                                        placeholder="Lição"
                                        value={licao}
                                        onChange={(e) => setLicao(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-span-2 grid grid-cols-2 text-center">
                                    <label htmlFor="NomeProfessor" className="font-bold text-lg -mt-4 -ml-6">Nome do Professor</label>
                                    {isEditMode ? (                           
                                       <p className="ml-5">{professorSelecionado?.nome || 'Nome do professor não informado'}</p>

                                    ) : (
                                        <select
                                            value={professorSelecionado?.id || ''}  // Define o valor do select
                                            className="border-2 border-gray-300 p-2 rounded-lg w-full"
                                            onChange={(e) => {
                                                const selectedId = Number(e.target.value);
                                                const selectedProfessor = professores.find(prof => prof.id === selectedId);
                                                setProfessorSelecionado(selectedProfessor || null);  // Atualiza o estado com o professor selecionado
                                            }}
                                        >
                                            <option value="">Selecione um professor</option>
                                            {professores.map((professor) => (
                                                <option key={professor.id} value={professor.id}>
                                                    {professor.nome}
                                                </option>
                                            ))}
                                        </select>

                                    )}
                                </div>
                                <div className="col-span-2 grid grid-cols-2 text-center -ml-6">
                                    <label htmlFor="AlunosMatriculados" className="font-bold text-lg">Alunos Matriculados</label>
                                    <input
                                        id="AlunosMatriculados"
                                        className="border-2 border-gray-300 p-2 rounded-lg w-full"
                                        type="number"
                                        placeholder="Alunos Matriculados"
                                        value={alunosMatriculados}
                                        onChange={(e) => setAlunosMatriculados(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-span-2 grid grid-cols-2 gap-4 text-center">
                                    <label htmlFor="Visitantes" className="font-bold text-lg">Visitantes</label>
                                    <input
                                        id="Visitantes"
                                        className="border-2 border-gray-300 p-2 rounded-lg w-full"
                                        type="number"
                                        placeholder="Visitantes"
                                        value={visitantes}
                                        onChange={(e) => setVisitantes(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-span-2 grid grid-cols-2 gap-4 text-center">
                                    <label htmlFor="Presentes" className="font-bold text-lg">Presentes</label>
                                    <input
                                        id="Presentes"
                                        className="border-2 border-gray-300 p-2 rounded-lg w-full"
                                        type="number"
                                        placeholder="Presentes"
                                        value={presentes}
                                        onChange={(e) => setPresentes(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-span-2 grid grid-cols-2 gap-4 text-center">
                                    <label htmlFor="Ausentes" className="font-bold text-lg">Ausentes</label>
                                    <input
                                        id="Ausentes"
                                        className="border-2 border-gray-300 p-2 rounded-lg w-full"
                                        type="number"
                                        placeholder="Ausentes"
                                        value={ausentes}
                                        onChange={(e) => setAusentes(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-span-2 grid grid-cols-2 text-center -ml-6">
                                    <label htmlFor="TotalAssistencia" className="font-bold text-lg">Total de Assistência</label>
                                    <input
                                        id="TotalAssistencia"
                                        className="border-2 border-gray-300 p-2 rounded-lg w-full"
                                        type="number"
                                        placeholder="Total de Assistência"
                                        value={totalAssistencia}
                                        onChange={(e) => setTotalAssistencia(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-span-2 grid grid-cols-2 gap-10 text-center">
                                    <label htmlFor="Biblias" className="font-bold text-lg">Bíblias</label>
                                    <input
                                        id="Biblias"
                                        className="border-2 border-gray-300 p-2 rounded-lg w-full"
                                        type="number"
                                        placeholder="Bíblias"
                                        value={biblias}
                                        onChange={(e) => setBiblias(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-span-2 grid grid-cols-2 gap-4 text-center">
                                    <label htmlFor="Revistas" className="font-bold text-lg">Revistas</label>
                                    <input
                                        id="Revistas"
                                        className="border-2 border-gray-300 p-2 rounded-lg w-full"
                                        type="number"
                                        placeholder="Revistas"
                                        value={revistas}
                                        onChange={(e) => setRevistas(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-span-2 grid grid-cols-2 gap-10 text-center">
                                    <label htmlFor="Oferta" className="font-bold text-lg">Oferta</label>
                                    <input
                                        id="Oferta"
                                        className="border-2 border-gray-300 p-2 rounded-lg w-full"
                                        type="number"
                                        step="0.01"
                                        placeholder="Oferta"
                                        value={oferta}
                                        onChange={(e) => setOferta(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="flex text-center gap-5">

                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit">
                                <BiSend size={24} />
                            </button>

                            <Button variant="primary" className='btn-primary' as="a" href="/aulas">VOLTAR</Button>

                                
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <footer>
                <Footer/>
            </footer>
        </>
    
    );
}

export default NewAula;

