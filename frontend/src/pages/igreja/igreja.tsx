
import Button from "react-bootstrap/esm/Button";
import DataTableIgreja from "../../components/tables/tableIgreja";
import Header from "../../components/header/header";
import Menu from "../../components/menu/Menu";
import Footer from "../../components/footer/footer";

function Igreja(){

    return(
        <>
            <div className="flex flex-col -mb-56">
                    <Header />
                    <Menu />
                    <h3 className="flex text-slate-800 w-screen justify-center mt-4 -mb-2">Lista Igrejas</h3>
            </div> 
           <div className=" flex flex-col text-center w-screen h-screen p-5">
                <DataTableIgreja/>
                <Button variant="primary" className='btn-primary mb-3' as="a" href="/home">VOLTAR</Button>
            </div>

            <footer>
                <Footer />
            </footer>
        </>     
    )
}

export default Igreja;