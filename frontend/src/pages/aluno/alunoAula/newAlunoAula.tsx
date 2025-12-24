/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Aula } from "../../../types/aula";
import { Aluno } from "../../../types/aluno";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../service/api";
import Header from "../../../components/header/header";
import { Button } from "react-bootstrap";
import { BiSend } from "react-icons/bi";
import Footer from "../../../components/footer/footer";

function NewAlunoAula() {

    const [id, setId] = useState(null);
    const [aluno, setAluno] = useState<Aluno[]>([]);
    const [idAluno, setIdAluno] = useState(null);
    const [nomeAluno, setNomeAluno] = useState('');
    const [aula, setAula] = useState<Aula[]>([]);
    const [licao, setLicao] = useState('');
    const [idAula, setIdAula] = useState(null);
    const { alunoAulaID } = useParams();
    const history = useNavigate();


    async function loadAlunoAula() {
        try {
            const response = await api.get(`/api/alunos/aluno-aula-vinculo/${alunoAulaID}`);
            setId(response.data.id);
            setIdAluno(response.data.idAluno);
            setNomeAluno(response.data.nomeAluno);
            setIdAula(response.data.IdAula);
            setLicao(response.data.licao);
        } catch (error) {
            alert('Error while fetching EbdAula. Try again!');
            history('/alunosEaulas');
        }
    }

    async function loadAulas() {
        try {
            const response = await api.get('/api/aulas');
            setAula(response.data);
        } catch (error) {
            console.error('Error fetching aulas:', error);
        }
    }

    async function loadAlunos() {
        try {
            const response = await api.get('/api/alunos');
            setAluno(response.data);
        } catch (error) {
            console.error('Error fetching aulas:', error);
        }
    }


    useEffect(() => {
        if (alunoAulaID !== '0') loadAlunoAula();
        loadAulas();
        loadAlunos();
    }, [alunoAulaID]);

    async function saveOrUpdate(e: { preventDefault: () => void; }) {
        e.preventDefault();
        const data = {
            idAluno: idAluno, // Usar ebdId em vez de nomeEbd
            idAula: idAula, // Usar aulaId em vez de nomeAula
        };
        try {
            if (alunoAulaID === '0') {
                await api.post('/api/alunos/aluno-aula-vinculo', data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                data.id = id;
                await api.put(`/api/alunos/aluno-aula-vinculo/${alunoAulaID}`, data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }

            history('/alunosEaulas');
        } catch (error) {
            alert('Error while recording igreja. Try again!');
            console.error('Error details:', error);
        }
    }

    const handleAlunoChange = (e: { target: { value: any; }; }) => {
        const selectedIdAluno = e.target.value;
        const selectedAluno = aluno.find(aluno => aluno.id === parseInt(selectedIdAluno));
        setIdAluno(selectedIdAluno);
        setNomeAluno(selectedAluno ? selectedAluno.nome : '');
    };

    const handleAulaChange = (e: { target: { value: any; }; }) => {
        const selectedIdAula = e.target.value;
        const selectedAula = aula.find(aula => aula.id === parseInt(selectedIdAula));
        setIdAula(selectedIdAula);
        setLicao(selectedAula ? selectedAula.licao : '');
    };


    return (
        <>
            <Header />
            <div className="w-screen h-screen bg-gradient-to-t from-slate-700 flex flex-col justify-center items-center mt-10">
                <h1 className="text-5xl mb-10">{alunoAulaID === '0' ? 'Add' : 'Update'} AlunoAula</h1>
                <form onSubmit={saveOrUpdate} className="bg-gradient-to-t from-zinc-300 w-3/6 h-3/4 flex flex-col items-center justify-center gap-3">
                    <label htmlFor="NomeAula" className="text-2xl text-rose-800">Nome Aula</label>
                    <select
                        id="NomeAula"
                        value={idAula || ''}
                        onChange={handleAulaChange}
                        className="w-60 text-black bg-red-400"
                    >
                        <option value="">Selecione uma aula</option>
                        {aula.map(aula => (
                            <option key={aula.id} value={aula.id}>{aula.licao}</option>
                        ))}
                    </select>
                    <label htmlFor="NomeAluno" className="text-2xl text-rose-800">Nome Aluno</label>
                    <select
                        id="NomeAluno"
                        value={idAluno || ''}
                        onChange={handleAlunoChange}
                        className="w-60 text-black bg-red-400"
                    >
                        <option value="">Selecione um aluno</option>
                        {aluno.map(aluno => (
                            <option key={aluno.id} value={aluno.id}>{aluno.nome}</option>
                        ))}
                    </select>
                    <button type="submit" className="flex items-center justify-center">
                        {alunoAulaID === '0' ? 'Add' : 'Update'}
                        <BiSend title={alunoAulaID === '0' ? 'Add' : 'Update'} color="green" className="w-20 h-12" />
                    </button>
                    <Button as="a" href="/alunosEaulas">VOLTAR</Button>
                </form>
                <footer className="w-screen">
                    <Footer/>
                </footer>
            </div>


        </>
    )
}

export default NewAlunoAula;