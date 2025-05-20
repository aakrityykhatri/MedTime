import { useContext, useEffect, useState } from "react";
import { NurseContext } from "../../context/NurseContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const HospitalRounds = () => {
    const { nToken, backendUrl } = useContext(NurseContext);
    const [loading, setLoading] = useState(true);
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [roundNotes, setRoundNotes] = useState("");
    const [showRoundVisitModal, setShowRoundVisitModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (nToken) {
            fetchAdmittedPatients();
        }
    }, [nToken]);

    const fetchAdmittedPatients = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${backendUrl}/api/nurse/patients?status=Admitted`, {
                headers: {
                    ntoken: nToken
                }
            });
            const data = await response.json();
            
            if (data.success) {
                setPatients(data.patients);
            } else {
                console.error("Failed to fetch patients:", data.message);
                toast.error("Failed to load patients");
            }
        } catch (error) {
            console.error("Error fetching patients:", error);
            toast.error("An error occurred while loading patients");
        } finally {
            setLoading(false);
        }
    };

    const handleRecordRoundVisit = async () => {
        if (!roundNotes.trim()) {
            toast.warning("Please enter round visit notes");
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/api/nurse/patients/${selectedPatient._id}/rounds`, {
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
                fetchAdmittedPatients();
            } else {
                toast.error(data.message || "Failed to record round visit");
            }
        } catch (error) {
            console.error("Error recording round visit:", error);
            toast.error("An error occurred while recording round visit");
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

    const getLastRoundVisit = (patient) => {
        if (!patient.roundVisits || patient.roundVisits.length === 0) {
            return null;
        }

        const sortedVisits = [...patient.roundVisits].sort((a, b) => new Date(b.date) - new Date(a.date));
        return sortedVisits[0];
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
                <h1 className="text-xl font-medium">Hospital Rounds</h1>
                <button 
                    onClick={() => navigate('/nurse-dashboard')}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                    Back to Dashboard
                </button>
            </div>

            {patients.length > 0 ? (
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ward/Bed</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Round Visit</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {patients.map((patient) => {
                                    const lastVisit = getLastRoundVisit(patient);
                                    
                                    return (
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
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {lastVisit ? (
                                                    <div>
                                                        <div className="text-sm text-gray-900">{formatDate(lastVisit.date)}</div>
                                                        <div className="text-sm text-gray-500 truncate max-w-xs">{lastVisit.notes}</div>
                                                    </div>
                                                ) : (
                                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                        No visits recorded
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button 
                                                    onClick={() => {
                                                        setSelectedPatient(patient);
                                                        setShowRoundVisitModal(true);
                                                    }}
                                                    className="px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors mr-2"
                                                >
                                                    Record Visit
                                                </button>
                                                <button 
                                                    onClick={() => navigate(`/nurse-patient-details/${patient._id}`)}
                                                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white p-10 rounded-lg shadow text-center">
                    <p className="text-lg text-gray-600">No admitted patients found</p>
                </div>
            )}

            {/* Round Visit Modal */}
            {showRoundVisitModal && selectedPatient && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-lg font-medium mb-4">Record Round Visit for {selectedPatient.name}</h3>
                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center">
                                    {selectedPatient.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium">{selectedPatient.name}</p>
                                    <p className="text-sm text-gray-600">Ward: {selectedPatient.wardNumber}, Bed: {selectedPatient.bedNumber}</p>
                                </div>
                            </div>
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
                                onClick={() => {
                                    setShowRoundVisitModal(false);
                                    setRoundNotes("");
                                }}
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

export default HospitalRounds;
