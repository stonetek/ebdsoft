/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate} from "react-router-dom";
import api from "../../../service/api";
import { BiSend } from "react-icons/bi";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import { Button } from "react-bootstrap";


const areas = [
    { value: "AREA_01", label: "Área 1" },
    { value: "AREA_02", label: "Área 2" },
    { value: "AREA_03", label: "Área 3" },
    { value: "AREA_04", label: "Área 4" },
    { value: "AREA_05", label: "Área 5" },
    { value: "AREA_06", label: "Área 6" },
    { value: "AREA_07", label: "Área 7" },
    { value: "AREA_08", label: "Área 8" },
    { value: "AREA_09", label: "Área 9" },
    { value: "AREA_10", label: "Área 10" },
    { value: "AREA_11", label: "Área 11" }
];

function NewIgreja () {

    const [ id, setId] = useState(null);
    const [ nome, setNome] = useState('');
    const [ endereco, setEndereco] = useState('');
    const [ cnpj, setCnpj] = useState('');
    const [ cep, setCep] = useState('');
    const [ bairro, setBairro] = useState('');
    const [ cidade, setCidade] = useState('');
    const [ area, setArea] = useState('');

    const {igrejaID} = useParams();

    const history = useNavigate();

    
    async function loadIgreja() {
        try {
            const response = await api.get(`/api/igrejas/${igrejaID}`)
            
            setId(response.data.id);
            setNome(response.data.nome);
            setEndereco(response.data.endereco);
            setBairro(response.data.bairro);
            setCidade(response.data.cidade);
            setCnpj(response.data.cnpj);
            setCep(response.data.cep);
            setArea(response.data.area);
            
        } catch (error) {
            alert('Error recovering igreja" Try again!');
            history('/igrejas')
        }
    }

    useEffect(() => {
        if (igrejaID === '0') return;
        else loadIgreja();
    }, [igrejaID])


    const handleCnpjChange = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        const numericValue = value.replace(/\D/g, '');
        setCnpj(numericValue);
    };

    async function saveOrUpdate(e:{ preventDefault: () => void; }) {
        e.preventDefault();

        const data: { id?: number | null, nome: string, endereco: string, bairro: string, cidade: string, cnpj: string, cep: string, area: string } = {
            nome,
            endereco,
            bairro,
            cidade,
            cnpj,
            cep,
            area
        }
        try {
            if (igrejaID === '0') {
                await api.post('/api/igrejas', data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                data.id = id;
                await api.put(`/api/igrejas/${igrejaID}`, data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }

            history('/igrejas')
        } catch (error) {
            alert('Error while recording igreja Try again!')
        }       
    }



    return (
        <>
          <Header/>
            <div className="w-screen h-screen bg-gradient-to-t from-slate-700 flex flex-col justify-center items-center mt-1">
                <h1 className="text-5xl mb-4 -mt-8">{igrejaID === '0' ? "'Add' " : "'Update' "}Igreja</h1>

                <form 
                    key={igrejaID}
                    onSubmit={saveOrUpdate}
                    className="bg-gradient-to-t from-zinc-300 w-3/6 h-3/4 
                    flex flex-col items-center justify-center gap-3 mt-5 rounded-5">
                    <label htmlFor="Nome" className="text-2xl text-rose-800" >Nome</label>
                    <input type="text"
                    value={nome}
                    onChange={e => setNome(e.target.value)} 
                    className="w-60 text-black bg-red-400 pl-2" />

                    <label htmlFor="Endereco" className="text-2xl text-rose-800" >Endereço</label>
                    <input type="text"
                    value={endereco}
                    onChange={e => setEndereco(e.target.value)} 
                    className="w-60 text-black bg-red-400 pl-2" />

                    <label htmlFor="Bairro" className="text-2xl text-rose-800" >Bairro</label>
                    <input type="text"
                    value={bairro}
                    onChange={e => setBairro(e.target.value)} 
                    className="w-60 text-black bg-red-400 pl-2" />

                    <label htmlFor="Cidade" className="text-2xl text-rose-800" >Cidade</label>
                    <input type="text"
                    value={cidade}
                    onChange={e => setCidade(e.target.value)} 
                    className="w-60 text-black bg-red-400 pl-2" />

                    <label htmlFor="Cnpj" className="text-2xl text-rose-800" >CNPJ</label>
                    <input type="text"
                    value={cnpj}
                    onChange={handleCnpjChange}
                    className="w-60 text-black bg-red-400 pl-2"
                    maxLength={14}
                    minLength={14} />

                    <label htmlFor="Cep" className="text-2xl text-rose-800" >CEP</label>
                    <input type="text"
                    value={cep}
                    onChange={e => setCep(e.target.value)} 
                    className="w-60 text-black bg-red-400 pl-2" />

                    <label htmlFor="Area" className="text-2xl text-rose-800" >Área</label>
                    <select 
                        value={area} 
                        onChange={e => setArea(e.target.value)} 
                        className="w-60 text-black bg-red-400 pl-2"
                    >
                        <option value="">Selecione uma área</option>
                        {areas.map((area) => (
                        <option key={area.value} value={area.value}>{area.label}</option>
                        ))}
                    </select>
                    
                    <div className="flex text-center mb-5 gap-4">
                    
                    <button type="submit" onClick={saveOrUpdate} className="w-20 h-16 flex items-center justify-center" >
                        {igrejaID === '0' ? "'Add'" : "'Update'"}
                        <BiSend title="Adicionar" color="green" className="w-20 h-16" />
                    </button>

                    <Button variant="primary" className='btn-primary' as="a" href="/igrejas">VOLTAR</Button>

                    </div>                 
                </form>
            </div>

          <footer>
            <Footer/>
          </footer>          
        
        </>
    )
}

export default NewIgreja;