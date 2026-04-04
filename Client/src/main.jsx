
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import MainRouter from './Router/MainRouter'

createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
    <MainRouter/>
   </BrowserRouter>
  
)
