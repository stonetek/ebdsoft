/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../service/api";
import Header from "../../../components/header/header";
import { BiSend } from "react-icons/bi";
import { EbdTurmas } from "../../../types/ebdTurmas";
import { Button } from "react-bootstrap";



function NewProfessor() {
    
    const [ id, setId] = useState(null);
    const [ nome, setNome] = useState('');
    const [ aniversario, setAniversario] = useState('');
    const [igrejaId] = useState<number | null>(() => {
        const storedIgrejaId = sessionStorage.getItem('igrejaId');
        if (!storedIgrejaId || storedIgrejaId === 'null' || storedIgrejaId === 'undefined') return null;
        const parsed = Number(storedIgrejaId);
        return Number.isNaN(parsed) ? null : parsed;
    });
    const [turmas, setTurmas] = useState<EbdTurmas[]>([]);
    const [turmaSelecionada, setTurmaSelecionada] = useState<number | "">("");

    const {professorID} = useParams();
    const history = useNavigate();

    async function loadProfessor() {
        try {
            const response = await api.get(`/api/professores/${professorID}`)
            const formatLocalDate1 = response.data.aniversario.split("T", 10)[0];
            setId(response.data.id);
            setNome(response.data.nome);
            setAniversario(formatLocalDate1)
            
        } catch (error) {
            alert('Error recovering professor" Try again!');
            history('/professores')
        }
    }

    useEffect(() => {
        if (professorID === '0') return;
        else loadProfessor();
    }, [professorID])

    useEffect(() => {
        if (igrejaId) {
            loadTurmas();
        }
    }, [igrejaId]);

    async function loadTurmas() {
        if (!igrejaId) return;
    
        try {
            const response = await api.get(`/api/igrejas/${igrejaId}/ebd-turmas`);
            // Acessa o array de turmas dentro da resposta
            const turmasArray = Array.isArray(response.data.turmas) ? response.data.turmas : [];
            setTurmas(turmasArray);
        } catch (error) {
            alert('Error loading turmas. Try again!');
        }
    }
    

    async function saveOrUpdate(e:{ preventDefault: () => void; }) {
        e.preventDefault();
        
        const data: { nome: string; aniversario?: string; igrejaId?: number; turmaId?: number; id?: number | null } = {
            nome,
            ...(aniversario ? { aniversario} : {}),
            ...(igrejaId ? { igrejaId } : {}),
            ...(igrejaId && turmaSelecionada ? { turmaId: turmaSelecionada } : {}),
        };
    
        try {
            if (professorID === '0') {
                await api.post('/api/professores', data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                data.id = id;
                await api.put(`/api/professores/${professorID}`, data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }

            history('/professores')
        } catch (error) {
            alert('Error while recording professor Try again!')
        }       
    }

   

    return(
        <>

          <Header/>
          <div className="w-screen h-screen bg-gradient-to-t from-slate-700 flex flex-col justify-center items-center mt-10 ">
          <h1 className="text-5xl mb-10">{professorID === '0' ? "'Add' " : "'Update' "}Professor</h1>

          <form 
                    key={professorID}
                    onSubmit={saveOrUpdate}
                    className="bg-gradient-to-t from-zinc-300 w-3/6 h-3/4 
                    flex flex-col items-center justify-center gap-3">
                    <label htmlFor="Nome" className="text-2xl text-rose-800" >Nome</label>
                    <input type="text"
                    value={nome}
                    onChange={e => setNome(e.target.value)} 
                    className="w-60 text-black bg-red-400 p-1" />

                    <label htmlFor="Niver" className="text-2xl text-rose-800" >Aniversário</label>
                    <input type="date"
                    value={aniversario}
                    onChange={e => setAniversario(e.target.value)} 
                    className="w-60 text-black bg-red-400 p-1"/>

                    {igrejaId && (
                        <>
                            <label htmlFor="Turma" className="text-2xl text-rose-800">Turma</label>
                            <select
                                value={turmaSelecionada ?? ''}
                                onChange={e => {
                                    const val = Number(e.target.value);
                                    setTurmaSelecionada(Number.isNaN(val) ? "" : val);
                                }}
                                className="w-60 text-black bg-red-400 p-1">
                                <option value="">Selecione uma turma</option>
                                {turmas.map(turma => (
                                    <option key={turma.id} value={turma.id}>{turma.nomeTurma}</option>
                                ))}
                            </select>
                        </>
                    )}
                    
                    <div className="flex text-center gap-5">

                        <button type="submit" className="w-20 h-15 flex items-center justify-center" >
                            {professorID === '0' ? "'Add'" : "'Update'"}
                            <BiSend title="Adicionar" color="green" className="w-1/4 h-1/4" />
                        </button>

                        <Button variant="primary" className='btn-primary' as="a" href="/professores">VOLTAR</Button>

                    </div>
                </form>
          </div>          
        
        </>
    )
}

export default NewProfessor;