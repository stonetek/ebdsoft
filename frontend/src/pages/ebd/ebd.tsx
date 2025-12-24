import { Button } from "react-bootstrap";
import DataTableEbd from "../../components/tables/tableEbd";
import Menu from "../../components/menu/Menu";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";


function Ebd(){

    return(
        <>
            <div className="flex flex-col -mb-40">
                <Header />
                <Menu />
                <h3 className="flex text-slate-800 w-screen justify-center mt-4 -mb-2">Lista Escola Bíblica</h3>
            </div>

           <div className="flex-col text-center w-screen h-screen p-5">  
                <DataTableEbd/>
                <Button variant="primary" className='btn-primary mb-3' as="a" href="/home">VOLTAR</Button>
            </div>

            <footer>
                <Footer />
            </footer>
        </>     
    )
}

export default Ebd;