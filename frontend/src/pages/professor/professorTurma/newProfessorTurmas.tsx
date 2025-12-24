/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { BiSend } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { Turma } from "../../../types/turma";
import { Professor } from "../../../types/professor";
import api from "../../../service/api";
import Header from "../../../components/header/header";

function NewProfessorTurmas() {

    const [id, setId] = useState(null);
    const [nomeProfessor, setNomeProfessor] = useState('');
    const [nomeTurma, setNomeTurma] = useState('');
    const [idProfessor, setIdProfessor] = useState(null);
    const [idTurma, setIdTurma] = useState(null);
    const [turma, setTurma] = useState<Turma[]>([]);
    const [professor, setProfessor] = useState<Professor[]>([]);
    const { professorTurmaID } = useParams();
    const history = useNavigate();

    async function loadProfessorTurma() {
        try {
            const response = await api.get(`/api/professores/professor-turma-vinculo/${professorTurmaID}`);
            setId(response.data.id);
            setIdProfessor(response.data.idProfessor);
            setNomeProfessor(response.data.nomeProfessor);
            setIdTurma(response.data.idTurma);
            setNomeTurma(response.data.nomeTurma);
        } catch (error) {
            alert('Error while fetching ProfessorTurma. Try again!');
            history('/professorEturmas');
        }
    }

    async function loadTurmas() {
        try {
            const response = await api.get('/api/turmas');
            setTurma(response.data);
        } catch (error) {
            console.error('Error fetching turmas:', error);
        }
    }

    async function loadProfessores() {
        try {
            const response = await api.get('/api/professores');
            setProfessor(response.data);
        } catch (error) {
            console.error('Error fetching Professors:', error);
        }
    }

    useEffect(() => {
        if (professorTurmaID !== '0') loadProfessorTurma();
        loadTurmas();
        loadProfessores();
    }, [professorTurmaID]);

    async function saveOrUpdate(e: { preventDefault: () => void; }) {
        e.preventDefault();
        const data = {
            idProfessor: idProfessor,
            idTurma: idTurma,
        };

        try {
            if (professorTurmaID === '0') {
                await api.post('/api/professores/professor-turma-vinculo', data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                data.id = id;
                await api.put(`/api/professores/professor-turma-vinculo/${professorTurmaID}`, data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }

            history('/professorEturmas');
        } catch (error) {
            alert('Essa turma já está vinculada a esta professor. Tente outra Turma ou Professor');
            console.error('Error details:', error);
        }
    }

    const handleProfessorChange = (e: { target: { value: any; }; }) => {
        const selectedIdProfessor = e.target.value;
        const selectedProfessor = professor.find(professor => professor.id === parseInt(selectedIdProfessor));
        setIdProfessor(selectedIdProfessor);
        setNomeProfessor(selectedProfessor ? selectedProfessor.nome : '');
    };

    const handleTurmaChange = (e: { target: { value: any; }; }) => {
        const selectedIdTurma = e.target.value;
        const selectedTurma = turma.find(turma => turma.id === parseInt(selectedIdTurma));
        setIdTurma(selectedIdTurma);
        setNomeTurma(selectedTurma ? selectedTurma.nome : '');
    };

    return (
        <>
            <Header />
            <div className="w-screen h-screen bg-gradient-to-t from-slate-700 flex flex-col justify-center items-center mt-10">
                <h1 className="text-5xl mb-10">{professorTurmaID === '0' ? 'Add' : 'Update'} ProfessorTurma</h1>
                <form onSubmit={saveOrUpdate} className="bg-gradient-to-t from-zinc-300 w-3/6 h-3/4 flex flex-col items-center justify-center gap-3">
                    <label htmlFor="NomeProfessor" className="text-2xl text-rose-800">Nome Professor</label>
                    <select
                        id="NomeProfessor"
                        value={idProfessor || ''}
                        onChange={handleProfessorChange}
                        className="w-60 text-black bg-red-400"
                    >
                        <option value="">Selecione um Professor</option>
                        {professor.map(professor => (
                            <option key={professor.id} value={professor.id}>{professor.nome}</option>
                        ))}
                    </select>
                    <label htmlFor="NomeTurma" className="text-2xl text-rose-800">Nome Turma</label>
                    <select
                        id="NomeTurma"
                        value={idTurma || ''}
                        onChange={handleTurmaChange}
                        className="w-60 text-black bg-red-400"
                    >
                        <option value="">Selecione uma turma</option>
                        {turma.map(turma => (
                            <option key={turma.id} value={turma.id}>{turma.nome}</option>
                        ))}
                    </select>
                    <button type="submit" className="flex items-center justify-center">
                        {professorTurmaID === '0' ? 'Add' : 'Update'}
                        <BiSend title={professorTurmaID === '0' ? 'Add' : 'Update'} color="green" className="w-20 h-12" />
                    </button>
                    <Button as="a" href="/professores">VOLTAR</Button>
                </form>
            </div>
        </>
    );
}

export default NewProfessorTurmas;