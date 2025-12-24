/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Igreja } from "../../../types/igreja";
import { Ebd } from "../../../types/ebd";
import api from "../../../service/api";
import Header from "../../../components/header/header";
import { Button } from "react-bootstrap";
import { BiSend } from "react-icons/bi";


function NewIgrejaEbd() {

    const [id, setId] = useState(null);
    const [nomeIgreja, setNomeIgreja] = useState('');
    const [nomeEbd, setNomeEbd] = useState('');
    const [idEbd, setIdEbd] = useState(null);
    const [idIgreja, setIdIgreja] = useState(null);
    const [igreja, setIgreja] = useState<Igreja[]>([]);
    const [ebd, setEbd] = useState<Ebd[]>([]);
    const { igrejaEbdID } = useParams();
    const history = useNavigate();

    async function loadIgrejaEbd() {
        try {
            const response = await api.get(`/api/igrejas/igreja-ebd-vinculo/${igrejaEbdID}`);
            setId(response.data.id);
            setIdIgreja(response.data.idIgreja);
            setNomeIgreja(response.data.nomeIgreja);
            setIdEbd(response.data.idEbd);
            setNomeEbd(response.data.nomeEbd);
        } catch (error) {
            alert('Error while fetching IgrejaEbd. Try again!');
            history('/igrejaEebd');
        }
    }

   async function loadIgrejas() {
    try {
        const storedIgrejaId = sessionStorage.getItem('igrejaId');
        //console.log("🔍 igrejaId no sessionStorage:", storedIgrejaId);

        if (storedIgrejaId && storedIgrejaId !== "null" && storedIgrejaId !== "undefined") {
            //console.log("🔒 Usuário comum - carregando apenas a igreja:", storedIgrejaId);
            const response = await api.get(`/api/igrejas/${storedIgrejaId}`);
            setIgreja([response.data]); // mantém o formato de array
        } else {
            //console.log("🧑‍💼 Usuário administrador - carregando todas as igrejas");
            const response = await api.get('/api/igrejas');
            //console.log("✅ Igrejas recebidas:", response.data);
            setIgreja(response.data);
        }
    } catch (error) {
        console.error('❌ Erro ao buscar igrejas:', error);
    }
}


    async function loadEbds() {
        try {
            const response = await api.get('/api/escolabiblica');
            setEbd(response.data);
        } catch (error) {
            console.error('Error fetching ebds:', error);
        }
    }

    useEffect(() => {
        if (igrejaEbdID !== '0') loadIgrejaEbd();
        loadIgrejas();
        loadEbds();
    }, [igrejaEbdID]);

    async function saveOrUpdate(e: { preventDefault: () => void; }) {
        e.preventDefault();
        const data = {
            idIgreja: idIgreja, // Usar igrejaId em vez de nomeIgreja
            idEbd: idEbd, // Usar ebdId em vez de nomeEbd
        };
        try {
            if (igrejaEbdID === '0') {
                await api.post('/api/igrejas/igreja-ebd-vinculo', data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                data.id = id;
                await api.put(`/api/igrejas/igreja-ebd-vinculo/${igrejaEbdID}`, data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }

            history('/igrejaEebd');
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                // Verifica se a mensagem de erro contém a exceção específica
                if (error.response.data.message.includes('IgrejaAlreadyEnrolledException')) {
                    alert('A Igreja já está vinculada com a EBD especificada.');
                } else {
                    alert('Erro ao tentar vincular: ' + error.response.data.message);
                }
            } else {
                alert('Erro ao tentar vincular!');
            }
            console.error('Error details:', error);
        }
    }

    const handleEbdChange = (e: { target: { value: any; }; }) => {
        const selectedIdEbd = e.target.value;
        const selectedEbd = ebd.find(ebd => ebd.id === parseInt(selectedIdEbd));
        setIdEbd(selectedIdEbd);
        setNomeEbd(selectedEbd ? selectedEbd.nome : '');
    };

    const handleIgrejaChange = (e: { target: { value: any; }; }) => {
        const selectedIdIgreja = e.target.value;
        const selectedIgreja = igreja.find(igreja => igreja.id === parseInt(selectedIdIgreja));
        setIdIgreja(selectedIdIgreja);
        setNomeIgreja(selectedIgreja ? selectedIgreja.nome : '');
    };

    return (
        <>
            <Header />
            <div className="w-screen h-screen bg-gradient-to-t from-slate-700 flex flex-col justify-center items-center mt-10">
                <h1 className="text-5xl mb-10">{igrejaEbdID === '0' ? 'Add' : 'Update'} IgrejaEbd</h1>
                <form onSubmit={saveOrUpdate} className="bg-gradient-to-t from-zinc-300 w-3/6 h-3/4 flex flex-col items-center justify-center gap-3">
                    <label htmlFor="NomeIgreja" className="text-2xl text-rose-800">Nome Igreja</label>
                    <select
                        id="NomeIgreja"
                        value={idIgreja || ''}
                        onChange={handleIgrejaChange}
                        className="w-60 text-black bg-red-400"
                    >
                        <option value="">Selecione uma igreja</option>
                        {igreja.map(igreja => (
                            <option key={igreja.id} value={igreja.id}>{igreja.nome}</option>
                        ))}
                    </select>
                    <label htmlFor="NomeEbd" className="text-2xl text-rose-800">Nome Ebd</label>
                    <select
                        id="NomeEbd"
                        value={idEbd || ''}
                        onChange={handleEbdChange}
                        className="w-60 text-black bg-red-400"
                    >
                        <option value="">Selecione uma EBD</option>
                        {ebd.map(ebd => (
                            <option key={ebd.id} value={ebd.id}>{ebd.nome}</option>
                        ))}
                    </select>
                    <button type="submit" className="flex items-center justify-center">
                        {igrejaEbdID === '0' ? 'Add' : 'Update'}
                        <BiSend title={igrejaEbdID === '0' ? 'Add' : 'Update'} color="green" className="w-20 h-12" />
                    </button>
                    <Button as="a" href="/igrejaEebd">VOLTAR</Button>
                </form>
            </div>
        
        </>
    )
}

export default NewIgrejaEbd;