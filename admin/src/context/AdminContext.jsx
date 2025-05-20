import { createContext, useState } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'

export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const [aToken,setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
    const [doctors,setDoctors] = useState([])
    const [appointments,setAppointments] = useState([])
    const [dashData,setDashData] = useState(false)
    const [pharmacies, setPharmacies] = useState([])
    const [nurses, setNurses] = useState([]);

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const getAllDoctors = async () => {
        
        try {

            const {data} = await axios.post(backendUrl + '/api/admin/all-doctors', {},{headers:{aToken}})
            if (data.success) {
                setDoctors(data.doctors)
                console.log(data.doctors);               
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }

    }

    const changeAvailablity = async (docId) => {

        try {
            
            const { data } = await axios.post(backendUrl + '/api/admin/change-availablity', {docId},{headers:{aToken}})
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }

    }

    const getAllAppointments = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + '/api/admin/appointments',
                { headers: { aToken } }
            )
            if (data.success) {
                // Sort appointments by date in descending order
                const sortedAppointments = data.appointments.sort((a, b) => 
                    new Date(b.date) - new Date(a.date)
                );
                setAppointments(sortedAppointments);
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    

    const cancelAppointment = async (appointmentId) => {
        try {
            
            const {data} = await axios.post(backendUrl + '/api/admin/cancel-appointment', {appointmentId},{headers:{aToken}})
            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const getDashData = async () => {
        try {
            
            const {data} = await axios.get(backendUrl + '/api/admin/dashboard',{headers:{aToken}})
            if (data.success) {
                setDashData(data.dashData)
                console.log(data.dashData);
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const getAllPharmacies = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + '/api/admin/all-pharmacies',
                { headers: { aToken } }
            )
            if (data.success) {
                setPharmacies(data.pharmacies)
                console.log("Fetched pharmacies:", data.pharmacies) // Debug log
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    
    const changePharmacyAvailability = async (pharmacyId) => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/admin/change-pharmacy-availability',
                { pharmacyId },
                { headers: { aToken } }
            )
            if (data.success) {
                toast.success(data.message)
                getAllPharmacies() // Refresh the list
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    
    const getAllNurses = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + '/api/admin/all-nurses',
                { headers: { aToken } }
            );
            if (data.success) {
                setNurses(data.nurses);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const changeNurseAvailability = async (nurseId) => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/admin/change-nurse-availability',
                { nurseId },
                { headers: { aToken } }
            );
            if (data.success) {
                toast.success(data.message);
                getAllNurses();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const value = {
        aToken,setAToken,
        backendUrl,doctors,
        getAllDoctors, changeAvailablity,
        getAllAppointments,appointments,
        setAppointments,
        cancelAppointment,
        getDashData,dashData,
        getAllPharmacies, pharmacies,
        changePharmacyAvailability,
        nurses,
        getAllNurses,
        changeNurseAvailability
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )

}

export default AdminContextProvider