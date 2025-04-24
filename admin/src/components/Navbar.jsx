import { useContext } from "react"
import { assets } from "../assets/assets"
import { AdminContext } from "../context/AdminContext"
import { DoctorContext } from "../context/DoctorContext"
import { PharmacyContext } from "../context/PharmacyContext"
import { NurseContext } from "../context/NurseContext"
import { useNavigate } from "react-router-dom"

const Navbar = () => {
    const {aToken, setAToken} = useContext(AdminContext)
    const {dToken, setDToken} = useContext(DoctorContext)
    const {pToken, setPToken} = useContext(PharmacyContext)
    const {nToken, setNToken} = useContext(NurseContext)

    const navigate = useNavigate()

    const logout = () => {
        navigate('/')
        if (aToken) {
            setAToken('')
            localStorage.removeItem('aToken')
        }
        if (dToken) {
            setDToken('')
            localStorage.removeItem('dToken')
        }
        if (pToken) {
            setPToken('')
            localStorage.removeItem('pToken')
        }
        if (nToken) {
          setNToken('');
          localStorage.removeItem('nToken');
      }
    }

    const getUserType = () => {
        if (aToken) return 'Admin'
        if (dToken) return 'Doctor'
        if (pToken) return 'Pharmacy'
        if (nToken) return 'Nurse';
        return ''
    }

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
      <div className="flex items-center gap-2 text-xs">
        <img className="w-24 sm:w-28 cursor-pointer" src={assets.admin_logo} alt="" />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">{getUserType()}</p>
      </div>
      <button onClick={logout} className="bg-primary text-white text-sm px-10 py-2 rounded-full">Logout</button>
    </div>
  )
}

export default Navbar
