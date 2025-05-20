import { useContext, useEffect, useState } from "react";
import { NurseContext } from "../../context/NurseContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LabReports = () => {
    const { nToken, backendUrl } = useContext(NurseContext);
    const [loading, setLoading] = useState(true);
    const [pendingReports, setPendingReports] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (nToken) {
            fetchPendingReports();
        }
    }, [nToken]);

    const fetchPendingReports = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${backendUrl}/api/nurse/patients?hasUnverifiedReports=true`, {
                headers: {
                    ntoken: nToken
                }
            });
            const data = await response.json();
            
            if (data.success) {
                // Process the data to extract patients with unverified reports
                const patientsWithReports = [];
                
                data.patients.forEach(patient => {
                    if (patient.labReports && patient.labReports.length > 0) {
                        const unverifiedReports = patient.labReports.filter(report => !report.verified);
                        
                        if (unverifiedReports.length > 0) {
                            patientsWithReports.push({
                                patientId: patient._id,
                                patientName: patient.name,
                                wardNumber: patient.wardNumber,
                                bedNumber: patient.bedNumber,
                                reports: unverifiedReports
                            });
                        }
                    }
                });
                
                setPendingReports(patientsWithReports);
            } else {
                console.error("Failed to fetch pending reports:", data.message);
                toast.error("Failed to load pending reports");
            }
        } catch (error) {
            console.error("Error fetching pending reports:", error);
            toast.error("An error occurred while loading pending reports");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyReport = async (patientId, reportId) => {
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
                fetchPendingReports();
            } else {
                toast.error(data.message || "Failed to verify report");
            }
        } catch (error) {
            console.error("Error verifying report:", error);
            toast.error("An error occurred while verifying report");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
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
                <h1 className="text-xl font-medium">Lab Reports Verification</h1>
                <button 
                    onClick={() => navigate('/nurse-dashboard')}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                    Back to Dashboard
                </button>
            </div>

            {pendingReports.length > 0 ? (
                <div className="space-y-6">
                    {pendingReports.map((patient) => (
                        <div key={patient.patientId} className="bg-white p-6 rounded-lg shadow">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-lg font-medium">{patient.patientName}</h2>
                                    <p className="text-sm text-gray-600">
                                        Ward: {patient.wardNumber}, Bed: {patient.bedNumber}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => navigate(`/nurse-patient-details/${patient.patientId}`)}
                                    className="px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm"
                                >
                                    View Patient
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Results</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {patient.reports.map((report) => (
                                            <tr key={report._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.testName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(report.date)}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{report.results}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button 
                                                        onClick={() => handleVerifyReport(patient.patientId, report._id)}
                                                        className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
                                                    >
                                                        Verify
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-10 rounded-lg shadow text-center">
                    <p className="text-lg text-gray-600">No pending lab reports to verify</p>
                </div>
            )}
        </div>
    );
};

export default LabReports;
