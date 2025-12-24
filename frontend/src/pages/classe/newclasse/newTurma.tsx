/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../components/header/header";
import { BiSend } from "react-icons/bi";
import { useEffect, useState } from "react";
import api from "../../../service/api";
import { Button } from "react-bootstrap";


function NewTurma() {

    const [ id, setId] = useState<number | null>(null);
    const [ nome, setNome] = useState('');
    const [idadeMinima, setIdadeMinima] = useState('');
    const [idadeMaxima, setIdadeMaxima] = useState('');
    


    const {classeID} = useParams();

    const history = useNavigate();

    async function loadClasse() {
        try {
            const response = await api.get(`/api/turmas/${classeID}`)
            
            setId(response.data.id);
            setNome(response.data.nome);
            setIdadeMinima(response.data.idadeMinima);
            setIdadeMaxima(response.data.idadeMaxima);                      
        } catch (error) {
            alert('Error recovering classe" Try again!');
            history('/classes')
        }
    }

    useEffect(() => {
        if (classeID === '0') return;
        else loadClasse();
    }, [classeID])

    async function saveOrUpdate(e:{ preventDefault: () => void; }) {
        e.preventDefault();
        const igrejaId = sessionStorage.getItem('igrejaId');
        const data: { id?: number | null; nome: string; idadeMinima: string; idadeMaxima: string; igrejaId: number | null } = {
            nome,
            idadeMinima,
            idadeMaxima,
            igrejaId: igrejaId ? parseInt(igrejaId, 10) : null
        }
        try {
            if (classeID === '0') {
                await api.post('/api/turmas', data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                data.id = id;
                await api.put(`/api/turmas/${classeID}`, data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }

            history('/classes')
        } catch (error) {
            alert('Error while recording aluno Try again!')
        }       
    }
    
    return(
        <>
          <Header/>
          <div className="w-screen h-screen bg-gradient-to-t from-slate-700 flex flex-col justify-center items-center ">
          <h1 className="text-5xl">{classeID === '0' ? "'Add' " : "'Update' "}Classe</h1>

          <form 
                    key={classeID}
                    onSubmit={saveOrUpdate}
                    className="bg-gradient-to-t from-zinc-300 w-3/6 h-3/4 
                    flex flex-col items-center justify-center gap-3">
                    <label htmlFor="Nome" className="text-2xl text-rose-800" >Nome</label>
                    <input type="text"
                    value={nome}
                    onChange={e => setNome(e.target.value)} 
                    className="w-60 text-black bg-red-400" />

                    <label htmlFor="IdadeMinima" className="text-2xl text-rose-800" >Idade Mínima</label>
                    <input type="text"
                    value={idadeMinima}
                    onChange={e => setIdadeMinima(e.target.value)} 
                    className="w-60 text-black bg-red-400" />

                    <label htmlFor="IdadeMaxima" className="text-2xl text-rose-800" >Idade Máxima</label>
                    <input type="text"
                    value={idadeMaxima}
                    onChange={e => setIdadeMaxima(e.target.value)} 
                    className="w-60 text-black bg-red-400" />

                    <div className="flex text-center gap-5">                  
                        <button type="submit" onClick={saveOrUpdate} className="w-20 h-32 flex items-center justify-center" >
                            {classeID === '0' ? "'Add'" : "'Update'"}
                            <BiSend title="Adicionar" color="green" className="w-20 h-20" />
                        </button>

                        <Button variant="primary" className='btn-primary' as="a" href="/classes">VOLTAR</Button>
                    </div>
                </form>
          </div>          
        </>
    )
}

export default NewTurma;