import { useContext } from "react"
import { AdminContext } from "../context/AdminContext"
import { NavLink } from "react-router-dom"
import { assets } from "../assets/assets"
import { DoctorContext } from "../context/DoctorContext"
import { PharmacyContext } from "../context/PharmacyContext"
import { NurseContext } from "../context/NurseContext"

const Sidebar = () => {
    const {aToken} = useContext(AdminContext)
    const {dToken} = useContext(DoctorContext)
    const {pToken} = useContext(PharmacyContext)
    const {nToken} = useContext(NurseContext)

    return (
        <div className="min-h-screen bg-white border-r">
            {/* Admin Sidebar */}
            {aToken && (
                <ul className="text-[#515151] mt-5">
                    <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/admin-dashboard'}>
                        <img src={assets.home_icon} alt="" />
                        <p className="hidden md:block">Dashboard</p>
                    </NavLink>

                    <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/all-appointments'}>
                        <img src={assets.appointment_icon} alt="" />
                        <p className="hidden md:block">Appointments</p>
                    </NavLink>

                    <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/add-doctor'}>
                        <img src={assets.add_icon} alt="" />
                        <p className="hidden md:block">Add Doctor</p>
                    </NavLink>

                    <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/doctor-list'}>
                        <img src={assets.people_icon} alt="" />
                        <p className="hidden md:block">Doctors List</p>
                    </NavLink>
                    
                    <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/add-pharmacy'}>
                      <img src={assets.add_icon} alt="" />
                      <p className="hidden md:block">Add Pharmacy</p>
                  </NavLink>

                  <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/pharmacy-list'}>
                      <img src={assets.people_icon} alt="" />
                      <p className="hidden md:block">Pharmacy List</p>
                  </NavLink>
                </ul>
            )}

            {/* Doctor Sidebar */}
            {dToken && (
                <ul className="text-[#515151] mt-5">
                    <NavLink className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to="/doctor-dashboard">
                        <img src={assets.home_icon} alt="" />
                        <p className="hidden md:block">Dashboard</p>
                    </NavLink>

                    <NavLink className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to="/doctor-appointments">
                        <img src={assets.appointment_icon} alt="" />
                        <p className="hidden md:block">Appointments</p>
                    </NavLink>
                      <NavLink className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to="/doctor-calendar">
                        <img src={assets.appointment_icon} alt="" />
                        <p className="hidden md:block">Calendar</p>
                    </NavLink>

                    <NavLink className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to="/doctor-profile">
                        <img src={assets.people_icon} alt="" />
                        <p className="hidden md:block">Profile</p>
                    </NavLink>
                </ul>
            )}


            {/* Pharmacy Sidebar */}
            {pToken && (
                <ul className="text-[#515151] mt-5">
                    <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/pharmacy-dashboard'}>
                        <img src={assets.home_icon} alt="" />
                        <p className="hidden md:block">Dashboard</p>
                    </NavLink>

                    <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/prescriptions'}>
                        <img src={assets.prescription_icon} alt="" />
                        <p className="hidden md:block">Prescriptions</p>
                    </NavLink>

                    <NavLink 
                        className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} 
                        to={'/patient-history'}
                    >
                        <img src={assets.history_icon} alt="" />
                        <p className="hidden md:block">Medicine History</p>
                    </NavLink>

                    <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/pharmacy-profile'}>
                        <img src={assets.people_icon} alt="" />
                        <p className="hidden md:block">Profile</p>
                    </NavLink>
                </ul>
            )}

            {nToken && (
                <ul className="text-[#515151] mt-5">
                    <NavLink 
                        className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} 
                        to={'/nurse-dashboard'}
                    >
                        <img src={assets.home_icon} alt="" />
                        <p className="hidden md:block">Dashboard</p>
                    </NavLink>

                    <NavLink 
                        className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} 
                        to={'/nurse-assessments'}
                    >
                        <img src={assets.appointment_icon} alt="" />
                        <p className="hidden md:block">Assessments</p>
                    </NavLink>

                    <NavLink 
                        className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} 
                        to={'/nurse-profile'}
                    >
                        <img src={assets.people_icon} alt="" />
                        <p className="hidden md:block">Profile</p>
                    </NavLink>
                </ul>
            )}
        </div>
    )
}

export default Sidebar
