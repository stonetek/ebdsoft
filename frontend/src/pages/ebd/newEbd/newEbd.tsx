/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Header from "../../../components/header/header";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../service/api";
import { BiSend } from "react-icons/bi";
import { Button } from "react-bootstrap";
import Footer from "../../../components/footer/footer";

function NewEbd() {
    const [ id, setId] = useState(null);
    const [ nome, setNome] = useState('');
    const [ coordenador, setCoordenador] = useState('');
    const [ viceCoordenador, setViceCoordenador] = useState('');
    const [ presbitero, setPresbitero] = useState('');


    const {ebdID} = useParams();

    const history = useNavigate();

    async function loadEbd() {
        try {
            const response = await api.get(`/api/escolabiblica/${ebdID}`)
            
            setId(response.data.id);
            setNome(response.data.nome);
            setCoordenador(response.data.coordenador);
            setViceCoordenador(response.data.viceCoordenador);
            setPresbitero(response.data.presbitero);
        } catch (error) {
            alert('Error recovering aluno" Try again!');
            history('/escolabiblica')
        }
    }

    useEffect(() => {
        if (ebdID === '0') return;
        else loadEbd();
    }, [ebdID])

    async function saveOrUpdate(e:{ preventDefault: () => void; }) {
        e.preventDefault();

        const data = {
            nome,
            coordenador,
            viceCoordenador,
            presbitero,
            id: ebdID !== '0' ? id : undefined,
        }
        try {
            if (ebdID === '0') {
                await api.post('/api/escolabiblica', data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                data.id = id;
                await api.put(`/api/escolabiblica/${ebdID}`, data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }

            history('/escolabiblica')
        } catch (error) {
            alert('Error while recording aluno Try again!')
        }       
    }
        



    return (
        <>
            <Header/>
            <div className="w-screen h-screen bg-gradient-to-t from-slate-700 flex flex-col justify-center items-center mt-10 ">
                <h1 className="text-5xl mb-10">{ebdID === '0' ? "'Add' " : "'Update' "}EBD</h1>

                <form 
                    key={ebdID}
                    onSubmit={saveOrUpdate}
                    className="bg-gradient-to-t from-zinc-300 w-3/6 h-3/4 
                    flex flex-col items-center justify-center gap-3 mb-5 rounded-5">
                    <label htmlFor="Nome" className="text-2xl text-rose-800" >Nome</label>
                    <input type="text"
                    value={nome}
                    onChange={e => setNome(e.target.value)} 
                    className="w-60 text-black bg-red-400 p-1" />

                    <label htmlFor="Coordenador" className="text-2xl text-rose-800" >Coordenador</label>
                    <input type="text"
                    value={coordenador}
                    onChange={e => setCoordenador(e.target.value)} 
                    className="w-60 text-black bg-red-400 p-1" />

                    <label htmlFor="ViceCoordenador" className="text-2xl text-rose-800" >ViceCoordenador</label>
                    <input type="text"
                    value={viceCoordenador}
                    onChange={e => setViceCoordenador(e.target.value)} 
                    className="w-60 text-black bg-red-400 p-1" />

                    <label htmlFor="Presbitero" className="text-2xl text-rose-800" >Presbitero Local</label>
                    <input type="text"
                    value={presbitero}
                    onChange={e => setPresbitero(e.target.value)} 
                    className="w-60 text-black bg-red-400 p-1" />
                                      
                    <div className="flex text-center gap-5">

                    <button type="submit" onClick={saveOrUpdate} className="w-20 h-40 flex items-center justify-center" >
                        {ebdID === '0' ? "'Add'" : "'Update'"}
                        <BiSend title="Adicionar" color="green" className="w-20 h-1/4" />
                    </button>

                    <Button variant="primary" className='btn-primary mb-3' as="a" href="/escolabiblica">VOLTAR</Button>
                      
                    </div>
                </form>

                <footer className="w-screen">
                    <Footer/>
                </footer>
            </div>       
        </>
    )
}

export default NewEbd;