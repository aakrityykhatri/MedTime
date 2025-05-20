import { useContext, useState } from "react"
import { PharmacyContext } from "../../context/PharmacyContext"
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from "../../assets/assets"
import { useNavigate } from 'react-router-dom' // Add this

const PharmacyLogin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { backendUrl, setPToken } = useContext(PharmacyContext)
    const navigate = useNavigate() // Add this

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {
            const { data } = await axios.post(backendUrl + '/api/pharmacy/login', { email, password })
            if (data.success) {
                localStorage.setItem('pToken', data.token)
                setPToken(data.token)
                toast.success('Login Successful')
                navigate('/pharmacy-dashboard') // Add this
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log("Login error:", error) // Add debug log
            toast.error(error.message)
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
                <p className='text-2xl font-semibold m-auto'><span className='text-primary'>Pharmacy</span> Login</p>
                <div className='w-full'>
                    <p>Email</p>
                    <input onChange={(e)=>setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
                </div>
                <div className='w-full'>
                    <p>Password</p>
                    <input onChange={(e)=>setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
                </div>
                <button className='bg-primary text-white w-full py-2 rounded-md text-base'>Login</button>
            </div>
        </form>
    )
}

export default PharmacyLogin
