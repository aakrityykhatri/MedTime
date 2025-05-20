import { useContext, useEffect, useState } from "react";
import { NurseContext } from "../../context/NurseContext";
import { useNavigate } from "react-router-dom";

const NursePatients = () => {
    const { nToken, backendUrl } = useContext(NurseContext);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const navigate = useNavigate();

    useEffect(() => {
        if (nToken) {
            fetchPatients();
        }
    }, [nToken, filter]);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            let url = `${backendUrl}/api/nurse/patients`;
            
            if (filter !== 'All') {
                url += `?status=${filter}`;
            }
            
            const response = await fetch(url, {
                headers: {
                    ntoken: nToken
                }
            });
            const data = await response.json();
            
            if (data.success) {
                setPatients(data.patients);
            } else {
                console.error("Failed to fetch patients:", data.message);
            }
        } catch (error) {
            console.error("Error fetching patients:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="m-5">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-medium">Patient Management</h1>
                <button 
                    onClick={() => navigate('/nurse-add-patient')}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                    Add New Patient
                </button>
            </div>

            {/* Filter tabs */}
            <div className="flex border-b mb-6">
                <button 
                    className={`px-4 py-2 ${filter === 'All' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
                    onClick={() => setFilter('All')}
                >
                    All Patients
                </button>
                <button 
                    className={`px-4 py-2 ${filter === 'Admitted' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
                    onClick={() => setFilter('Admitted')}
                >
                    Admitted
                </button>
                <button 
                    className={`px-4 py-2 ${filter === 'To Be Discharged' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
                    onClick={() => setFilter('To Be Discharged')}
                >
                    To Be Discharged
                </button>
                <button 
                    className={`px-4 py-2 ${filter === 'Follow Up' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
                    onClick={() => setFilter('Follow Up')}
                >
                    Follow Up
                </button>
                <button 
                    className={`px-4 py-2 ${filter === 'Checkup' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
                    onClick={() => setFilter('Checkup')}
                >
                    Checkup
                </button>
                <button 
                    className={`px-4 py-2 ${filter === 'Discharged' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
                    onClick={() => setFilter('Discharged')}
                >
                    Discharged
                </button>
            </div>

            {/* Patients list */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Patient Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ward/Bed
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Admission Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Doctor
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {patients.length > 0 ? (
                            patients.map((patient) => (
                                <tr key={patient._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center">
                                                {patient.name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                                                <div className="text-sm text-gray-500">{patient.gender}, {patient.age} yrs</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">Ward: {patient.wardNumber}</div>
                                        <div className="text-sm text-gray-500">Bed: {patient.bedNumber}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(patient.admissionDate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {patient.assignedDoctor ? (
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">Dr. {patient.assignedDoctor.name}</div>
                                                <div className="text-sm text-gray-500">{patient.assignedDoctor.speciality}</div>
                                            </div>
                                        ) : (
                                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                Not Assigned
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            patient.status === 'Admitted' 
                                                ? 'bg-green-100 text-green-800' 
                                                : patient.status === 'To Be Discharged'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {patient.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button 
                                            onClick={() => navigate(`/nurse-patient-details/${patient._id}`)}
                                            className="text-primary hover:text-primary/80 mr-3"
                                        >
                                            View
                                        </button>
                                        <button 
                                            onClick={() => navigate(`/nurse-edit-patient/${patient._id}`)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                    No patients found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NursePatients;
