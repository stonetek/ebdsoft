/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import Aniversários from "../../components/tables/tableAniversarios";
import ProfessorTurma from "../../components/tables/tableProfessorTurma";
import { animated, useSpring } from "react-spring";
import Header from "../../components/header/header";
import AlunoTurma from "../../components/tables/tableAlunoTurma";
import Footer from "../../components/footer/footer";
import { Button } from "react-bootstrap";

function Vinculos () {

    const [selectedVinculo, setSelectedVinculo] = useState('empresaNatureza');

    const [clickedVinculo, setClickedVinculo] = useState<string | null>(null);

    const renderVinculoTable = () => {
        switch(selectedVinculo) {
            case 'aniversarios':
                return <Aniversários />;
            case 'professorTurma':
                return <ProfessorTurma />;
            case 'professorAula':
                return <AlunoTurma />;
            default:
                return null;
        }
    }

    const [springProps] = useSpring(() => ({
        transform: 'scale(1)',
    }));

    const handleClick = (vinculo: string) => {
        setSelectedVinculo(vinculo);
        setClickedVinculo(vinculo);
        //setTimeout(() => setClickedVinculo(null), 200);
    };


    return (
        <>
            <Header/>
                <div className="flex">
                    <div className="left-0 top-22 h-screen bg-gray-300 w-1/6">
                    
                        <ul className="p-4">
                            <h1 className="text-4xl mb-5">Escolha um Relatório</h1>
                            <animated.li 
                                style={springProps}
                                className="hover:border hover:border-gray-500 hover:text-red-700 rounded mb-2"
                                onClick={() => handleClick('aniversarios')}
                            >
                                Aniversários
                            </animated.li>
                            <animated.li 
                                style={springProps}
                                className="hover:border hover:border-gray-500 hover:text-red-700 rounded mb-2"
                                onClick={() => handleClick('professorTurma')}
                            >
                                Professor e Turma
                            </animated.li>
                            <animated.li 
                                style={springProps}
                                className="hover:border hover:border-gray-500 hover:text-red-700 rounded"
                                onClick={() => handleClick('professorAula')}
                            >
                                Aluno e Turma
                            </animated.li>
                        </ul>

                        {clickedVinculo === null && (
                        <div className="w-40 ml-10">
                            <Button variant="primary" as="a" href="/home">VOLTAR</Button>
                        </div>
                    )}

                    </div>

                    <div className="ml-auto mr-4 w-screen h-screen">
                    
                        <h1 className="mt-10 text-2xl text-center">RELATÓRIOS</h1>

                        <div className="mx-auto mt-10 text-center">
                            <div className="inline-block">
                                {renderVinculoTable()}
                            </div>
                        </div>
                        
                    </div>
                </div>    
            <Footer />
        </>
    )
}

export default Vinculos;