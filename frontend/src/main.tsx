import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './../src/styles/global.css'
import MainRoutes from './routes/routes.tsx'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <MainRoutes/>
  </BrowserRouter>
)
