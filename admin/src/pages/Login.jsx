import { useContext, useState } from 'react'
import {assets} from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/DoctorContext'
import { PharmacyContext } from '../context/PharmacyContext'
import { NurseContext } from '../context/NurseContext' 
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [state, setState] = useState('Admin')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const {setAToken, backendUrl} = useContext(AdminContext)
    const {setDToken} = useContext(DoctorContext)
    const {setPToken} = useContext(PharmacyContext)
    const {setNToken} = useContext(NurseContext)
    const navigate = useNavigate(); 

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {
            if (state === 'Admin') {
                const {data} = await axios.post(backendUrl + '/api/admin/login', {email, password})
                if (data.success) {
                    localStorage.setItem('aToken', data.token)
                    setAToken(data.token) 
                    navigate('/admin-dashboard');              
                } else {
                    toast.error(data.message)
                }
            } 
            else if (state === 'Doctor') {
                const {data} = await axios.post(backendUrl + '/api/doctor/login', {email, password})
                if (data.success) {
                    localStorage.setItem('dToken', data.token)
                    setDToken(data.token)
                    navigate('/doctor-dashboard')             
                } else {
                    toast.error(data.message)
                }
            }
            else if (state === 'Pharmacy') {
                const {data} = await axios.post(backendUrl + '/api/pharmacy/login', {email, password})
                if (data.success) {
                    localStorage.setItem('pToken', data.token)
                    setPToken(data.token) 
                    navigate('/pharmacy-dashboard')            
                } else {
                    toast.error(data.message)
                }
            }
            // Add nurse login case
            else if (state === 'Nurse') {
                const {data} = await axios.post(backendUrl + '/api/nurse/login', {email, password})
                if (data.success) {
                    localStorage.setItem('nToken', data.token)
                    setNToken(data.token) 
                    navigate('/nurse-dashboard')            
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getLoginText = () => {
        switch(state) {
            case 'Admin':
                return (
                    <p>
                        Doctor Login? <span className='text-primary underline cursor-pointer' onClick={()=>setState('Doctor')}>Click here</span>
                        {' '} or Pharmacy Login? <span className='text-primary underline cursor-pointer' onClick={()=>setState('Pharmacy')}>Click here</span>
                        {' '} or Nurse Login? <span className='text-primary underline cursor-pointer' onClick={()=>setState('Nurse')}>Click here</span>
                    </p>
                )
            case 'Doctor':
                return (
                    <p>
                        Admin Login? <span className='text-primary underline cursor-pointer' onClick={()=>setState('Admin')}>Click here</span>
                        {' '} or Pharmacy Login? <span className='text-primary underline cursor-pointer' onClick={()=>setState('Pharmacy')}>Click here</span>
                        {' '} or Nurse Login? <span className='text-primary underline cursor-pointer' onClick={()=>setState('Nurse')}>Click here</span>
                    </p>
                )
            case 'Pharmacy':
                return (
                    <p>
                        Admin Login? <span className='text-primary underline cursor-pointer' onClick={()=>setState('Admin')}>Click here</span>
                        {' '} or Doctor Login? <span className='text-primary underline cursor-pointer' onClick={()=>setState('Doctor')}>Click here</span>
                        {' '} or Nurse Login? <span className='text-primary underline cursor-pointer' onClick={()=>setState('Nurse')}>Click here</span>
                    </p>
                )
            case 'Nurse':
                return (
                    <p>
                        Admin Login? <span className='text-primary underline cursor-pointer' onClick={()=>setState('Admin')}>Click here</span>
                        {' '} or Doctor Login? <span className='text-primary underline cursor-pointer' onClick={()=>setState('Doctor')}>Click here</span>
                        {' '} or Pharmacy Login? <span className='text-primary underline cursor-pointer' onClick={()=>setState('Pharmacy')}>Click here</span>
                    </p>
                )
            default:
                return null
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
                <p className='text-2xl font-semibold m-auto'>
                    <span className='text-primary'> {state} </span> Login
                </p>
                <div className='w-full'>
                    <p>Email</p>
                    <input 
                        onChange={(e)=>setEmail(e.target.value)} 
                        value={email} 
                        className='border border-[#DADADA] rounded w-full p-2 mt-1' 
                        type="email" 
                        required 
                    />
                </div>

                <div className='w-full'>
                    <p>Password</p>
                    <input 
                        onChange={(e)=>setPassword(e.target.value)} 
                        value={password} 
                        className='border border-[#DADADA] rounded w-full p-2 mt-1' 
                        type="password" 
                        required 
                    />
                </div>
                <button className='bg-primary text-white w-full py-2 rounded-md text-base'>
                    Login
                </button>
                {getLoginText()}
            </div>
        </form>
    )
}

export default Login
