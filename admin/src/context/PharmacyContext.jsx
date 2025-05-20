import { createContext, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

export const PharmacyContext = createContext()

const PharmacyContextProvider = (props) => {
    const [pToken, setPToken] = useState(localStorage.getItem('pToken') ? localStorage.getItem('pToken') : '')
    const [prescriptions, setPrescriptions] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const getPrescriptions = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + '/api/pharmacy/prescriptions',
                { headers: { ptoken: pToken } }
            );
            if (data.success) {
                // Ensure we have an array even if empty
                setPrescriptions(data.prescriptions || []);
            } else {
                toast.error(data.message);
                setPrescriptions([]); // Set empty array on error
            }
        } catch (error) {
            console.log("Error fetching prescriptions:", error);
            toast.error(error.message);
            setPrescriptions([]); // Set empty array on error
        }
    };

    const updatePrescriptionStatus = async (prescriptionId, status) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/pharmacy/update-dispensing`,
                { prescriptionId, status },
                { headers: { ptoken: pToken } }
            );
    
            if (data.success) {
                toast.success(data.message);
                getPrescriptions(); // Refresh the prescriptions list
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error updating prescription:", error);
            toast.error("Failed to update prescription status");
        }
    };

    const getDashboardData = async () => {
        try {
            const {data} = await axios.get(
                backendUrl + '/api/pharmacy/dashboard',
                { headers: { ptoken: pToken } } // Changed from pToken to ptoken
            )
            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const getProfileData = async () => {
        try {
            console.log("Fetching profile data..."); // Debug log
            const { data } = await axios.get(
                `${backendUrl}/api/pharmacy/profile`,
                { headers: { ptoken: pToken } }
            );
            console.log("Profile data response:", data); // Debug log
    
            if (data.success) {
                setProfileData(data.pharmacy);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Profile fetch error:", error);
            toast.error("Failed to load profile data");
            throw error; // Propagate error to component
        }
    };

    // Add axios interceptor to automatically add token to all requests
    axios.interceptors.request.use(
        (config) => {
            if (pToken && config.url.includes('/api/pharmacy')) {
                config.headers.ptoken = pToken;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    

    const value = {
        pToken, setPToken,
        backendUrl,
        prescriptions, setPrescriptions,
        getPrescriptions,
        updatePrescriptionStatus,
        dashData, setDashData,
        getDashboardData,
        profileData, setProfileData,
        getProfileData
    }

    return (
        <PharmacyContext.Provider value={value}>
            {props.children}
        </PharmacyContext.Provider>
    )
}

export default PharmacyContextProvider
