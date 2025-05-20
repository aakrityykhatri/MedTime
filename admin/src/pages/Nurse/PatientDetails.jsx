import { useContext, useEffect, useState } from "react";
import { NurseContext } from "../../context/NurseContext";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const PatientDetails = () => {
    const { nToken, backendUrl } = useContext(NurseContext);
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [doctors, setDoctors] = useState([]);
    const [showAssignDoctorModal, setShowAssignDoctorModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [showAddNoteModal, setShowAddNoteModal] = useState(false);
    const [noteText, setNoteText] = useState("");
    const [showAddVitalsModal, setShowAddVitalsModal] = useState(false);
    const [vitalSigns, setVitalSigns] = useState({
        temperature: "",
        bloodPressure: "",
        heartRate: "",
        respiratoryRate: "",
        oxygenSaturation: "",
        notes: ""
    });
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [taskData, setTaskData] = useState({
        description: "",
        dueDate: ""
    });
    const [showRoundVisitModal, setShowRoundVisitModal] = useState(false);
    const [roundNotes, setRoundNotes] = useState("");
    
    const { patientId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (nToken && patientId) {
            fetchPatientDetails();
            fetchDoctors();
        }
    }, [nToken, patientId]);

    const fetchPatientDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${backendUrl}/api/nurse/patients/${patientId}`, {
                headers: {
                    ntoken: nToken
                }
            });
            const data = await response.json();
            
            if (data.success) {
                setPatient(data.patient);
            } else {
                console.error("Failed to fetch patient details:", data.message);
                toast.error("Failed to load patient details");
            }
        } catch (error) {
            console.error("Error fetching patient details:", error);
            toast.error("An error occurred while loading patient details");
        } finally {
            setLoading(false);
        }
    };

    const fetchDoctors = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/nurse/doctors`, {
                headers: {
                    ntoken: nToken
                }
            });
            const data = await response.json();
            
            if (data.success) {
                setDoctors(data.doctors);
            } else {
                console.error("Failed to fetch doctors:", data.message);
            }
        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleAssignDoctor = async () => {
        if (!selectedDoctor) {
            toast.warning("Please select a doctor");
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/api/nurse/patients/${patientId}/assign-doctor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ntoken: nToken
                },
                body: JSON.stringify({ doctorId: selectedDoctor })
            });

            const data = await response.json();
            
            if (data.success) {
                toast.success("Doctor assigned successfully");
                setShowAssignDoctorModal(false);
                setSelectedDoctor("");
                fetchPatientDetails();
            } else {
                toast.error(data.message || "Failed to assign doctor");
            }
        } catch (error) {
            console.error("Error assigning doctor:", error);
            toast.error("An error occurred while assigning doctor");
        }
    };

    const handleAddNote = async () => {
        if (!noteText.trim()) {
            toast.warning("Please enter a note");
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/api/nurse/patients/${patientId}/notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ntoken: nToken
                },
                body: JSON.stringify({ note: noteText })
            });

            const data = await response.json();
            
            if (data.success) {
                toast.success("Note added successfully");
                setShowAddNoteModal(false);
                setNoteText("");
                fetchPatientDetails();
            } else {
                toast.error(data.message || "Failed to add note");
            }
        } catch (error) {
            console.error("Error adding note:", error);
            toast.error("An error occurred while adding note");
        }
    };

    const handleAddVitalSigns = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/nurse/patients/${patientId}/vitals`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ntoken: nToken
                },
                body: JSON.stringify(vitalSigns)
            });

            const data = await response.json();
            
            if (data.success) {
                toast.success("Vital signs recorded successfully");
                setShowAddVitalsModal(false);
                setVitalSigns({
                    temperature: "",
                    bloodPressure: "",
                    heartRate: "",
                    respiratoryRate: "",
                    oxygenSaturation: "",
                    notes: ""
                });
                fetchPatientDetails();
            } else {
                toast.error(data.message || "Failed to record vital signs");
            }
        } catch (error) {
            console.error("Error recording vital signs:", error);
            toast.error("An error occurred while recording vital signs");
        }
    };

    const handleAddTask = async () => {
        if (!taskData.description || !taskData.dueDate) {
            toast.warning("Please fill all required fields");
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/api/nurse/patients/${patientId}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ntoken: nToken
                },
                body: JSON.stringify(taskData)
            });

            const data = await response.json();
            
            if (data.success) {
                toast.success("Follow-up task added successfully");
                setShowAddTaskModal(false);
                setTaskData({
                    description: "",
                    dueDate: ""
                });
                fetchPatientDetails();
            } else {
                toast.error(data.message || "Failed to add follow-up task");
            }
        } catch (error) {
            console.error("Error adding follow-up task:", error);
            toast.error("An error occurred while adding follow-up task");
        }
    };

    const handleCompleteTask = async (taskId) => {
        try {
            const response = await fetch(`${backendUrl}/api/nurse/patients/${patientId}/tasks/${taskId}/complete`, {
                method: 'POST',
                headers: {
                    ntoken: nToken
                }
            });

            const data = await response.json();
            
            if (data.success) {
                toast.success("Task marked as completed");
                fetchPatientDetails();
            } else {
                toast.error(data.message || "Failed to complete task");
            }
        } catch (error) {
            console.error("Error completing task:", error);
            toast.error("An error occurred while completing task");
        }
    };

    const handleVerifyReport = async (reportId) => {
        try {
            const response = await fetch(`${backendUrl}/api/nurse/patients/${patientId}/lab-reports/${reportId}/verify`, {
                method: 'POST',
                headers: {
                    ntoken: nToken
                }
            });

            const data = await response.json();
            
            if (data.success) {
                toast.success("Report verified successfully");
                fetchPatientDetails();
            } else {
                toast.error(data.message || "Failed to verify report");
            }
        } catch (error) {
            console.error("Error verifying report:", error);
            toast.error("An error occurred while verifying report");
        }
    };

    const handleRecordRoundVisit = async () => {
        if (!roundNotes.trim()) {
            toast.warning("Please enter round visit notes");
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/api/nurse/patients/${patientId}/rounds`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ntoken: nToken
                },
                body: JSON.stringify({ notes: roundNotes })
            });

            const data = await response.json();
            
            if (data.success) {
                toast.success("Round visit recorded successfully");
                setShowRoundVisitModal(false);
                setRoundNotes("");
                fetchPatientDetails();
            } else {
                toast.error(data.message || "Failed to record round visit");
            }
        } catch (error) {
            console.error("Error recording round visit:", error);
            toast.error("An error occurred while recording round visit");
        }
    };

    const handleUpdateStatus = async (status) => {
        try {
            const response = await fetch(`${backendUrl}/api/nurse/patients/${patientId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ntoken: nToken
                },
                body: JSON.stringify({ status })
            });

            const data = await response.json();
            
            if (data.success) {
                toast.success(`Patient status updated to ${status}`);
                fetchPatientDetails();
            } else {
                toast.error(data.message || "Failed to update patient status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("An error occurred while updating status");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="m-5 text-center">
                <p className="text-lg text-gray-600">Patient not found</p>
                <button 
                    onClick={() => navigate('/nurse-patients')}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                    Back to Patients
                </button>
            </div>
        );
    }

    return (
        <div className="m-5">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-medium">Patient Details</h1>
                <div className="flex gap-2">
                    <button 
                        onClick={() => navigate('/nurse-patients')}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Back to Patients
                    </button>
                    <button 
                        onClick={() => navigate(`/nurse-edit-patient/${patientId}`)}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                        Edit Patient
                    </button>
                </div>
            </div>

            {/* Patient Header */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                        <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold">
                            {patient.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                            <h2 className="text-2xl font-medium">{patient.name}</h2>
                            <div className="flex flex-wrap gap-2 mt-1">
                                <span className="text-sm text-gray-600">
                                    {patient.age} years, {patient.gender}
                                </span>
                                <span className="text-sm text-gray-600">
                                    Ward: {patient.wardNumber}, Bed: {patient.bedNumber}
                                </span>
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    patient.status === 'Admitted' 
                                        ? 'bg-green-100 text-green-800' 
                                        : patient.status === 'To Be Discharged'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : patient.status === 'Follow Up'
                                        ? 'bg-blue-100 text-blue-800'
                                        : patient.status === 'Checkup'
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {patient.status}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                    {patient.status === 'Admitted' && (
                            <button 
                                onClick={() => handleUpdateStatus('To Be Discharged')}
                                className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors text-sm"
                            >
                                Mark for Discharge
                            </button>
                        )}
                        {patient.status === 'To Be Discharged' && (
                            <button 
                                onClick={() => handleUpdateStatus('Discharged')}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors text-sm"
                            >
                                Complete Discharge
                            </button>
                        )}
                        {patient.status === 'Admitted' && (
                            <button 
                                onClick={() => handleUpdateStatus('Follow Up')}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors text-sm"
                            >
                                Mark for Follow Up
                            </button>
                        )}
                        {patient.status === 'Admitted' && (
                            <button 
                                onClick={() => handleUpdateStatus('Checkup')}
                                className="px-3 py-1 bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 transition-colors text-sm"
                            >
                                Mark for Checkup
                            </button>
                        )}

                        <button 
                            onClick={() => setShowAddVitalsModal(true)}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors text-sm"
                        >
                            Record Vitals
                        </button>
                        <button 
                            onClick={() => setShowAddNoteModal(true)}
                            className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200 transition-colors text-sm"
                        >
                            Add Note
                        </button>
                        <button 
                            onClick={() => setShowRoundVisitModal(true)}
                            className="px-3 py-1 bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 transition-colors text-sm"
                        >
                            Record Round Visit
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b mb-6">
                <button 
                    className={`px-4 py-2 ${activeTab === 'overview' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button 
                    className={`px-4 py-2 ${activeTab === 'vitals' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('vitals')}
                >
                    Vital Signs
                </button>
                <button 
                    className={`px-4 py-2 ${activeTab === 'notes' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('notes')}
                >
                    Notes
                </button>
                <button 
                    className={`px-4 py-2 ${activeTab === 'reports' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('reports')}
                >
                    Lab Reports
                </button>
                <button 
                    className={`px-4 py-2 ${activeTab === 'tasks' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('tasks')}
                >
                    Follow-up Tasks
                </button>
                <button 
                    className={`px-4 py-2 ${activeTab === 'rounds' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('rounds')}
                >
                    Round Visits
                </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white p-6 rounded-lg shadow">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic Information */}
                            <div>
                                <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Name</p>
                                            <p className="font-medium">{patient.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Age</p>
                                            <p className="font-medium">{patient.age} years</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Gender</p>
                                            <p className="font-medium">{patient.gender}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Blood Type</p>
                                            <p className="font-medium">{patient.bloodType}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Contact Number</p>
                                            <p className="font-medium">{patient.contactNumber}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Hospital Information */}
                            <div>
                                <h3 className="text-lg font-medium mb-4">Hospital Information</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Ward Number</p>
                                            <p className="font-medium">{patient.wardNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Bed Number</p>
                                            <p className="font-medium">{patient.bedNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Admission Date</p>
                                            <p className="font-medium">{formatDate(patient.admissionDate)}</p>
                                        </div>
                                        {patient.dischargeDate && (
                                            <div>
                                                <p className="text-sm text-gray-500">Discharge Date</p>
                                                <p className="font-medium">{formatDate(patient.dischargeDate)}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm text-gray-500">Status</p>
                                            <p className="font-medium">{patient.status}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Doctor Information */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium">Assigned Doctor</h3>
                                    <button 
                                        onClick={() => setShowAssignDoctorModal(true)}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        {patient.assignedDoctor ? 'Change' : 'Assign'} Doctor
                                    </button>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    {patient.assignedDoctor ? (
                                        <div className="flex items-center">
                                            <img 
                                                src={patient.assignedDoctor.image}
                                                alt={patient.assignedDoctor.name}
                                                className="w-12 h-12 rounded-full object-cover mr-4"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://via.placeholder.com/100";
                                                }}
                                            />
                                            <div>
                                                <p className="font-medium">Dr. {patient.assignedDoctor.name}</p>
                                                <p className="text-sm text-gray-500">{patient.assignedDoctor.speciality}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No doctor assigned</p>
                                    )}
                                </div>
                            </div>

                            {/* Emergency Contact */}
                            <div>
                                <h3 className="text-lg font-medium mb-4">Emergency Contact</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Name</p>
                                            <p className="font-medium">{patient.emergencyContact?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Relationship</p>
                                            <p className="font-medium">{patient.emergencyContact?.relationship}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="font-medium">{patient.emergencyContact?.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="md:col-span-2">
                                <h3 className="text-lg font-medium mb-4">Address</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="font-medium">
                                        {patient.address?.line1}<br />
                                        {patient.address?.line2 && <>{patient.address.line2}<br /></>}
                                        {patient.address?.city}, {patient.address?.state} {patient.address?.zipCode}
                                    </p>
                                </div>
                            </div>

                            {/* Medical History */}
                            <div className="md:col-span-2">
                                <h3 className="text-lg font-medium mb-4">Medical History</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p>{patient.medicalHistory || "No medical history recorded"}</p>
                                </div>
                            </div>

                            {/* Allergies */}
                            <div className="md:col-span-2">
                                <h3 className="text-lg font-medium mb-4">Allergies</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    {patient.allergies && patient.allergies.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {patient.allergies.map((allergy, index) => (
                                                <span 
                                                    key={index}
                                                    className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                                                >
                                                    {allergy}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No allergies recorded</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Vital Signs Tab */}
                {activeTab === 'vitals' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Vital Signs History</h3>
                            <button 
                                onClick={() => setShowAddVitalsModal(true)}
                                className="px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm"
                            >
                                Record New Vitals
                            </button>
                        </div>

                        {patient.vitalSigns && patient.vitalSigns.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Pressure</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heart Rate</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Respiratory Rate</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">O2 Saturation</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {patient.vitalSigns.sort((a, b) => new Date(b.date) - new Date(a.date)).map((vital, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(vital.date)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vital.temperature}°C</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vital.bloodPressure}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vital.heartRate} bpm</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vital.respiratoryRate} breaths/min</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vital.oxygenSaturation}%</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{vital.notes || "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No vital signs recorded
                            </div>
                        )}
                    </div>
                )}

                {/* Notes Tab */}
                {activeTab === 'notes' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Nurse Notes</h3>
                            <button 
                                onClick={() => setShowAddNoteModal(true)}
                                className="px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm"
                            >
                                Add New Note
                            </button>
                        </div>

                        {patient.nurseNotes && patient.nurseNotes.length > 0 ? (
                            <div className="space-y-4">
                                {patient.nurseNotes.sort((a, b) => new Date(b.date) - new Date(a.date)).map((note, index) => (
                                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                        <div className="flex justify-between mb-2">
                                            <p className="text-sm text-gray-500">{formatDate(note.date)}</p>
                                        </div>
                                        <p className="text-gray-900">{note.note}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No notes recorded
                            </div>
                        )}
                    </div>
                )}

                {/* Lab Reports Tab */}
                {activeTab === 'reports' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Lab Reports</h3>
                        </div>

                        {patient.labReports && patient.labReports.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Results</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {patient.labReports.sort((a, b) => new Date(b.date) - new Date(a.date)).map((report, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.testName}</td>
   
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(report.date)}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{report.results}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {report.verified ? (
                                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            Verified
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                            Pending Verification
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {!report.verified && (
                                                        <button 
                                                            onClick={() => handleVerifyReport(report._id)}
                                                            className="text-primary hover:text-primary/80"
                                                        >
                                                            Verify
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No lab reports available
                            </div>
                        )}
                    </div>
                )}

                {/* Follow-up Tasks Tab */}
                {activeTab === 'tasks' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Follow-up Tasks</h3>
                            <button 
                                onClick={() => setShowAddTaskModal(true)}
                                className="px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm"
                            >
                                Add New Task
                            </button>
                        </div>

                        {patient.followUpTasks && patient.followUpTasks.length > 0 ? (
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-700">Pending Tasks</h4>
                                <div className="space-y-2">
                                    {patient.followUpTasks
                                        .filter(task => !task.completed)
                                        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                                        .map((task, index) => (
                                            <div key={index} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium">{task.description}</p>
                                                    <p className="text-sm text-gray-500">Due: {formatDate(task.dueDate)}</p>
                                                </div>
                                                <button 
                                                    onClick={() => handleCompleteTask(task._id)}
                                                    className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors text-sm"
                                                >
                                                    Complete
                                                </button>
                                            </div>
                                        ))}
                                    {patient.followUpTasks.filter(task => !task.completed).length === 0 && (
                                        <p className="text-center py-4 text-gray-500">No pending tasks</p>
                                    )}
                                </div>

                                {patient.followUpTasks.filter(task => task.completed).length > 0 && (
                                    <>
                                        <h4 className="font-medium text-gray-700 mt-6">Completed Tasks</h4>
                                        <div className="space-y-2">
                                            {patient.followUpTasks
                                                .filter(task => task.completed)
                                                .sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate))
                                                .map((task, index) => (
                                                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                                        <div>
                                                            <p className="font-medium">{task.description}</p>
                                                            <div className="flex justify-between">
                                                                <p className="text-sm text-gray-500">Due: {formatDate(task.dueDate)}</p>
                                                                <p className="text-sm text-green-600">Completed: {formatDate(task.completedDate)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No follow-up tasks available
                            </div>
                        )}
                    </div>
                )}

                {/* Round Visits Tab */}
                {activeTab === 'rounds' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Hospital Round Visits</h3>
                            <button 
                                onClick={() => setShowRoundVisitModal(true)}
                                className="px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm"
                            >
                                Record Round Visit
                            </button>
                        </div>

                        {patient.roundVisits && patient.roundVisits.length > 0 ? (
                            <div className="space-y-4">
                                {patient.roundVisits.sort((a, b) => new Date(b.date) - new Date(a.date)).map((visit, index) => (
                                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                        <div className="flex justify-between mb-2">
                                            <p className="text-sm text-gray-500">{formatDate(visit.date)}</p>
                                        </div>
                                        <p className="text-gray-900">{visit.notes}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No round visits recorded
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Assign Doctor Modal */}
            {showAssignDoctorModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-lg font-medium mb-4">Assign Doctor</h3>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="doctorSelect">
                                Select Doctor
                            </label>
                            <select
                                id="doctorSelect"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={selectedDoctor}
                                onChange={(e) => setSelectedDoctor(e.target.value)}
                            >
                                <option value="">Select a doctor</option>
                                {doctors.map((doctor) => (
                                    <option key={doctor._id} value={doctor._id}>
                                        Dr. {doctor.name} ({doctor.speciality})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button 
                                onClick={() => setShowAssignDoctorModal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleAssignDoctor}
                                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                            >
                                Assign
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Note Modal */}
            {showAddNoteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-lg font-medium mb-4">Add Nurse Note</h3>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="noteText">
                                Note
                            </label>
                            <textarea
                                id="noteText"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                rows="4"
                                placeholder="Enter your note here..."
                            ></textarea>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button 
                                onClick={() => setShowAddNoteModal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleAddNote}
                                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                            >
                                Save Note
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Vital Signs Modal */}
            {showAddVitalsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-lg font-medium mb-4">Record Vital Signs</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="temperature">
                                    Temperature (°C)
                                </label>
                                <input
                                    id="temperature"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="number"
                                    step="0.1"
                                    value={vitalSigns.temperature}
                                    onChange={(e) => setVitalSigns({...vitalSigns, temperature: e.target.value})}
                                    placeholder="e.g., 37.0"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bloodPressure">
                                    Blood Pressure (mmHg)
                                </label>
                                <input
                                    id="bloodPressure"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="text"
                                    value={vitalSigns.bloodPressure}
                                    onChange={(e) => setVitalSigns({...vitalSigns, bloodPressure: e.target.value})}
                                    placeholder="e.g., 120/80"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="heartRate">
                                    Heart Rate (bpm)
                                </label>
                                <input
                                    id="heartRate"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="number"
                                    value={vitalSigns.heartRate}
                                    onChange={(e) => setVitalSigns({...vitalSigns, heartRate: e.target.value})}
                                    placeholder="e.g., 75"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="respiratoryRate">
                                    Respiratory Rate (breaths/min)
                                </label>
                                <input
                                    id="respiratoryRate"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="number"
                                    value={vitalSigns.respiratoryRate}
                                    onChange={(e) => setVitalSigns({...vitalSigns, respiratoryRate: e.target.value})}
                                    placeholder="e.g., 16"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="oxygenSaturation">
                                    Oxygen Saturation (%)
                                </label>
                                <input
                                    id="oxygenSaturation"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="number"
                                    max="100"
                                    value={vitalSigns.oxygenSaturation}
                                    onChange={(e) => setVitalSigns({...vitalSigns, oxygenSaturation: e.target.value})}
                                    placeholder="e.g., 98"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
                                    Notes
                                </label>
                                <textarea
                                    id="notes"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={vitalSigns.notes}
                                    onChange={(e) => setVitalSigns({...vitalSigns, notes: e.target.value})}
                                    rows="2"
                                    placeholder="Any additional observations..."
                                ></textarea>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button 
                                onClick={() => setShowAddVitalsModal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleAddVitalSigns}
                                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                            >
                                Save Vitals
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Task Modal */}
            {showAddTaskModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-lg font-medium mb-4">Add Follow-up Task</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="taskDescription">
                                    Task Description
                                </label>
                                <input
                                    id="taskDescription"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="text"
                                    value={taskData.description}
                                    onChange={(e) => setTaskData({...taskData, description: e.target.value})}
                                    placeholder="Enter task description"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dueDate">
                                    Due Date
                                </label>
                                <input
                                    id="dueDate"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="datetime-local"
                                    value={taskData.dueDate}
                                    onChange={(e) => setTaskData({...taskData, dueDate: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button 
                                onClick={() => setShowAddTaskModal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleAddTask}
                                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                            >
                                Save Task
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Round Visit Modal */}
            {showRoundVisitModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-lg font-medium mb-4">Record Round Visit</h3>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="roundNotes">
                                Visit Notes
                            </label>
                            <textarea
                                id="roundNotes"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={roundNotes}
                                onChange={(e) => setRoundNotes(e.target.value)}
                                rows="4"
                                placeholder="Enter round visit observations..."
                            ></textarea>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button 
                                onClick={() => setShowRoundVisitModal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleRecordRoundVisit}
                                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                            >
                                Save Visit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientDetails;
