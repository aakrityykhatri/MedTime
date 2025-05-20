import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const NurseContext = createContext();

const NurseContextProvider = (props) => {
    const [nToken, setNToken] = useState(localStorage.getItem('nToken') || '');
    const [nurseData, setNurseData] = useState(null);
    const [pendingAssessments, setPendingAssessments] = useState([]);
    const [dashboardData, setDashboardData] = useState(null);
    const [patients, setPatients] = useState([]);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const getNurseProfile = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/nurse/profile`,
                { headers: { ntoken: nToken } }
            );
            if (data.success) {
                setNurseData(data.nurse);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Error fetching nurse profile');
        }
    };

    const updateNurseProfile = async (formData) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/nurse/update-profile`,
                formData,
                { 
                    headers: { 
                        ntoken: nToken,
                        'Content-Type': 'multipart/form-data'
                    } 
                }
            );
            if (data.success) {
                setNurseData(data.nurse);
                toast.success('Profile updated successfully');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Error updating profile');
        }
    };

    const changeAvailability = async () => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/nurse/change-availability`,
                {},
                { headers: { ntoken: nToken } }
            );
            if (data.success) {
                getNurseProfile();
                toast.success('Availability updated successfully');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Error updating availability');
        }
    };

    const getNurseDashboard = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/nurse/dashboard`,
                { headers: { ntoken: nToken } }
            );
            if (data.success) {
                setDashboardData(data.dashboardData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Error fetching dashboard data');
        }
    };

    const getPatients = async (status = '') => {
        try {
            let url = `${backendUrl}/api/nurse/patients`;
            if (status) {
                url += `?status=${status}`;
            }
            
            const { data } = await axios.get(
                url,
                { headers: { ntoken: nToken } }
            );
            
            if (data.success) {
                setPatients(data.patients);
                return data.patients;
            } else {
                toast.error(data.message);
                return [];
            }
        } catch (error) {
            console.error(error);
            toast.error('Error fetching patients');
            return [];
        }
    };

    const getPatientDetails = async (patientId) => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/nurse/patients/${patientId}`,
                { headers: { ntoken: nToken } }
            );
            
            if (data.success) {
                return data.patient;
            } else {
                toast.error(data.message);
                return null;
            }
        } catch (error) {
            console.error(error);
            toast.error('Error fetching patient details');
            return null;
        }
    };

    const addPatient = async (patientData) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/nurse/patients`,
                patientData,
                { 
                    headers: { 
                        ntoken: nToken,
                        'Content-Type': 'application/json'
                    } 
                }
            );
            
            if (data.success) {
                toast.success('Patient added successfully');
                return data.patient;
            } else {
                toast.error(data.message);
                return null;
            }
        } catch (error) {
            console.error(error);
            toast.error('Error adding patient');
            return null;
        }
    };

    const updatePatient = async (patientId, patientData) => {
        try {
            const { data } = await axios.put(
                `${backendUrl}/api/nurse/patients/${patientId}`,
                patientData,
                { 
                    headers: { 
                        ntoken: nToken,
                        'Content-Type': 'application/json'
                    } 
                }
            );
            
            if (data.success) {
                toast.success('Patient updated successfully');
                return data.patient;
            } else {
                toast.error(data.message);
                return null;
            }
        } catch (error) {
            console.error(error);
            toast.error('Error updating patient');
            return null;
        }
    };

    const recordVitalSigns = async (patientId, vitalData) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/nurse/patients/${patientId}/vitals`,
                vitalData,
                { 
                    headers: { 
                        ntoken: nToken,
                        'Content-Type': 'application/json'
                    } 
                }
            );
            
            if (data.success) {
                toast.success('Vital signs recorded successfully');
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            console.error(error);
            toast.error('Error recording vital signs');
            return false;
        }
    };

    const addNurseNote = async (patientId, note) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/nurse/patients/${patientId}/notes`,
                { note },
                { 
                    headers: { 
                        ntoken: nToken,
                        'Content-Type': 'application/json'
                    } 
                }
            );
            
            if (data.success) {
                toast.success('Note added successfully');
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            console.error(error);
            toast.error('Error adding note');
            return false;
        }
    };

    const recordRoundVisit = async (patientId, notes) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/nurse/patients/${patientId}/rounds`,
                { notes },
                { 
                    headers: { 
                        ntoken: nToken,
                        'Content-Type': 'application/json'
                    } 
                }
            );
            
            if (data.success) {
                toast.success('Round visit recorded successfully');
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            console.error(error);
            toast.error('Error recording round visit');
            return false;
        }
    };

    const verifyLabReport = async (patientId, reportId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/nurse/patients/${patientId}/lab-reports/${reportId}/verify`,
                {},
                { headers: { ntoken: nToken } }
            );
            
            if (data.success) {
                toast.success('Report verified successfully');
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            console.error(error);
            toast.error('Error verifying report');
            return false;
        }
    };

    const addFollowUpTask = async (patientId, taskData) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/nurse/patients/${patientId}/tasks`,
                taskData,
                { 
                    headers: { 
                        ntoken: nToken,
                        'Content-Type': 'application/json'
                    } 
                }
            );
            
            if (data.success) {
                toast.success('Follow-up task added successfully');
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            console.error(error);
            toast.error('Error adding follow-up task');
            return false;
        }
    };

    const completeFollowUpTask = async (patientId, taskId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/nurse/patients/${patientId}/tasks/${taskId}/complete`,
                {},
                { headers: { ntoken: nToken } }
            );
            
            if (data.success) {
                toast.success('Task marked as completed');
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            console.error(error);
            toast.error('Error completing task');
            return false;
        }
    };

    const assignDoctor = async (patientId, doctorId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/nurse/patients/${patientId}/assign-doctor`,
                { doctorId },
                { 
                    headers: { 
                        ntoken: nToken,
                        'Content-Type': 'application/json'
                    } 
                }
            );
            
            if (data.success) {
                toast.success('Doctor assigned successfully');
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            console.error(error);
            toast.error('Error assigning doctor');
            return false;
        }
    };

    const getDoctors = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/nurse/doctors`,
                { headers: { ntoken: nToken } }
            );
            
            if (data.success) {
                return data.doctors;
            } else {
                toast.error(data.message);
                return [];
            }
        } catch (error) {
            console.error(error);
            toast.error('Error fetching doctors');
            return [];
        }
    };

    useEffect(() => {
        if (nToken) {
            getNurseProfile();
        }
    }, [nToken]);

    const value = {
        nToken,
        setNToken,
        nurseData,
        setNurseData,
        pendingAssessments,
        setPendingAssessments,
        dashboardData,
        setDashboardData,
        patients,
        setPatients,
        getNurseProfile,
        updateNurseProfile,
        changeAvailability,
        getNurseDashboard,
        getPatients,
        getPatientDetails,
        addPatient,
        updatePatient,
        recordVitalSigns,
        addNurseNote,
        recordRoundVisit,
        verifyLabReport,
        addFollowUpTask,
        completeFollowUpTask,
        assignDoctor,
        getDoctors,
        backendUrl
    };

    return (
        <NurseContext.Provider value={value}>
            {props.children}
        </NurseContext.Provider>
    );
};

export default NurseContextProvider;

            
