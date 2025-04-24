import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AdminContextProvider from './context/AdminContext.jsx'
import DoctorContextProvider from './context/DoctorContext.jsx'
import AppContextProvider from './context/AppContext.jsx'
import PharmacyContextProvider from './context/PharmacyContext.jsx'
import NurseContextProvider from './context/NurseContext.jsx' // Add this

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <AppContextProvider>
            <AdminContextProvider>
                <DoctorContextProvider>
                    <PharmacyContextProvider>
                        <NurseContextProvider>
                            <App />
                        </NurseContextProvider>
                    </PharmacyContextProvider>
                </DoctorContextProvider>
            </AdminContextProvider>
        </AppContextProvider>
    </BrowserRouter>,
)
