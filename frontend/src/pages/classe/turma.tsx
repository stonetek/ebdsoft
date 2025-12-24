import { Button } from "react-bootstrap";
import DataTableTurma from "../../components/tables/tableTurma";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";


function Turma(){

    return(
        <>
            <div className="flex flex-col -mb-40"> 
                <Header />
                <h3 className="flex text-slate-800 w-screen justify-center mt-4 -mb-2">Lista Classes</h3>
            </div>

           <div className="flex-col text-center w-screen h-screen p-5">
                
                <DataTableTurma/>
                <Button variant="primary" className='btn-primary mb-3' as="a" href="/home">VOLTAR</Button>
            </div>

            <footer>
                <Footer />
            </footer>
        </>     
    )
}

export default Turma;