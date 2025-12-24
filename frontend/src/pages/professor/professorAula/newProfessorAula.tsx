/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Aula } from "../../../types/aula";
import { Professor } from "../../../types/professor";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../service/api";
import Header from "../../../components/header/header";
import { Button } from "react-bootstrap";
import { BiSend } from "react-icons/bi";

function NewProfessorAula() {

    const [id, setId] = useState(null);
    const [nomeProfessor, setNomeProfessor] = useState('');
    const [licao, setLicao] = useState('');
    const [idProfessor, setIdProfessor] = useState(null);
    const [idAula, setIdAula] = useState(null);
    const [aula, setAula] = useState<Aula[]>([]);
    const [professor, setProfessor] = useState<Professor[]>([]);
    const { professorAulaID } = useParams();
    const history = useNavigate();

    useEffect(() => {
        if (professorAulaID !== '0') {
            loadProfessorAula();
            loadAulas(); // Carregar aulas existentes para edição
        } else {
            loadAulasByTrimestre(); // Carregar aulas com base no trimestre e ano atuais para novo vínculo
        }
        loadProfessores();
    }, [professorAulaID]);



    async function loadProfessorAula() {
        try {
            const response = await api.get(`/api/professores/professor-aula-vinculo/${professorAulaID}`);
            setId(response.data.id);
            setIdProfessor(response.data.idProfessor);
            setNomeProfessor(response.data.nomeProfessor);
            setIdAula(response.data.idAula);
            setLicao(response.data.licao);
        } catch (error) {
            alert('Error while fetching ProfessorTurma. Try again!');
            history('/professorEaulas');
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

    async function loadAulasByTrimestre() {
        try {
            const today = new Date();
            const ano = today.getFullYear();
            const mes = today.getMonth();

            let trimestre;
            if (mes < 3) {
                trimestre = "1º trimestre";
            } else if (mes < 6) {
                trimestre = "2º trimestre";
            } else if (mes < 9) {
                trimestre = "3º trimestre";
            } else {
                trimestre = "4º trimestre";
            }

            const currentTrimestre = {
                trimestre: trimestre,
                ano: ano
            };

            const response = await api.post('/api/aulas/current-trimestre', currentTrimestre);
            setAula(response.data);
        } catch (error) {
            console.error('Error fetching aulas:', error);
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

    
    async function saveOrUpdate(e: { preventDefault: () => void; }) {
        e.preventDefault();
        const data = {
            idProfessor: idProfessor,
            idAula: idAula,
        };

        try {
            if (professorAulaID === '0') {
                await api.post('/api/professores/professor-aula-vinculo', data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                data.id = id;
                await api.put(`/api/professores/professor-aula-vinculo/${professorAulaID}`, data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }

            history('/professorEaulas');
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
        const selectedIdAula = e.target.value;
        const selectedAula = aula.find(aula => aula.id === parseInt(selectedIdAula));
        setIdAula(selectedIdAula);
        setLicao(selectedAula ? selectedAula.licao : '');
    };

    return (
        <>
            <Header />
            <div className="w-screen h-screen bg-gradient-to-t from-slate-700 flex flex-col justify-center items-center mt-10">
                <h1 className="text-5xl mb-10">{professorAulaID === '0' ? 'Add' : 'Update'} ProfessorAula</h1>
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
                    <label htmlFor="NomeTurma" className="text-2xl text-rose-800">Lição</label>
                    <select
                        id="NomeTurma"
                        value={idAula || ''}
                        onChange={handleTurmaChange}
                        className="w-60 text-black bg-red-400"
                    >
                        <option value="">Selecione uma lição</option>
                        {aula.map(aula => (
                            <option key={aula.id} value={aula.id}>{aula.licao}</option>
                        ))}
                    </select>
                    <button type="submit" className="flex items-center justify-center">
                        {professorAulaID === '0' ? 'Add' : 'Update'}
                        <BiSend title={professorAulaID === '0' ? 'Add' : 'Update'} color="green" className="w-20 h-12" />
                    </button>
                    <Button as="a" href="/professorEaulas">VOLTAR</Button>
                </form>
            </div>
        </>
    );

}

export default NewProfessorAula;