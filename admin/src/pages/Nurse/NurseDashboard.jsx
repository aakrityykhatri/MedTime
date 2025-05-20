import { useContext, useEffect, useState } from "react";
import { NurseContext } from "../../context/NurseContext";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const NurseDashboard = () => {
    const { nToken, backendUrl } = useContext(NurseContext);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (nToken) {
            fetchDashboardData();
        }
    }, [nToken]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${backendUrl}/api/nurse/dashboard`, {
                headers: {
                    ntoken: nToken
                }
            });
            const data = await response.json();
            
            if (data.success) {
                setDashboardData(data.dashboardData);
            } else {
                console.error("Failed to fetch dashboard data:", data.message);
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
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

    return dashboardData && (
        <div className="m-5">
            {/* Stats Cards */}
            <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
                    <img className="w-14" src={assets.patients_icon} alt="" />
                    <div>
                        <p className="text-xl font-semibold text-gray-600">{dashboardData.admittedPatientsCount}</p>
                        <p className="text-gray-400">Admitted Patients</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
                    <img className="w-14" src={assets.appointments_icon} alt="" />
                    <div>
                        <p className="text-xl font-semibold text-gray-600">{dashboardData.pendingFollowUps}</p>
                        <p className="text-gray-400">Pending Follow-ups</p>
                    </div>
                </div>

                {/* <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
                    <img className="w-14" src={assets.prescription_icon} alt="" />
                    <div>
                        <p className="text-xl font-semibold text-gray-600">{dashboardData.pendingReports}</p>
                        <p className="text-gray-400">Pending Reports</p>
                    </div>
                </div> */}

                <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
                    <img className="w-14" src={assets.completed_icon} alt="" />
                    <div>
                        <p className="text-xl font-semibold text-gray-600">{dashboardData.toBeDischarged}</p>
                        <p className="text-gray-400">To Be Discharged</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
                <img className="w-14" src={assets.stethoscope_icon} alt="" />
                <div>
                    <p className="text-xl font-semibold text-gray-600">{dashboardData.followUpCount || 0}</p>
                    <p className="text-gray-400">Follow Up</p>
                </div>
            </div>

            <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
                <img className="w-14" src={assets.checkup_icon} alt="" />
                <div>
                    <p className="text-xl font-semibold text-gray-600">{dashboardData.checkupCount || 0}</p>
                    <p className="text-gray-400">Checkup</p>
                </div>
            </div>


                        {/* Quick Actions */}
                        <div className="mt-8 flex flex-wrap gap-4">
                <button 
                    onClick={() => navigate('/nurse-patients')}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                    View All Patients
                </button>
                <button 
                    onClick={() => navigate('/nurse-add-patient')}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                    Add New Patient
                </button>
                {/* <button 
                    onClick={() => navigate('/nurse-reports')}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                    Verify Reports
                </button> */}
                {/* <button 
                    onClick={() => navigate('/nurse-rounds')}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                    Hospital Rounds
                </button> */}
            </div>

            {/* Recent Patients Section */}
            <div className="bg-white mt-8">
                <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border">
                    <img src={assets.list_icon} alt="" />
                    <p className="font-semibold">Recent Patients</p>
                </div>

                <div className="pt-4 border border-t-0">
                    {dashboardData.recentPatients.length > 0 ? (
                        dashboardData.recentPatients.map((patient, index) => (
                            <div 
                                className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100 cursor-pointer" 
                                key={index}
                                onClick={() => navigate(`/nurse-patient-details/${patient._id}`)}
                            >
                                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
                                    {patient.name.charAt(0)}
                                </div>
                                <div className="flex-1 text-sm">
                                    <p className="text-gray-800 font-medium">{patient.name}</p>
                                    <p className="text-gray-600">
                                        Ward: {patient.wardNumber}, Bed: {patient.bedNumber}
                                    </p>
                                </div>
                                <div>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        patient.status === 'Admitted' 
                                            ? 'bg-green-100 text-green-800' 
                                            : patient.status === 'To Be Discharged'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {patient.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-4 text-gray-500">No recent patients</div>
                    )}
                </div>
            </div>

            {/* Pending Tasks Section */}
            <div className="bg-white mt-8">
                <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border">
                    <img src={assets.list_icon} alt="" />
                    <p className="font-semibold">Pending Follow-up Tasks</p>
                </div>

                <div className="pt-4 border border-t-0">
                    {dashboardData.pendingTasks.length > 0 ? (
                        dashboardData.pendingTasks.map((task, index) => (
                            <div 
                                className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100 cursor-pointer" 
                                key={index}
                                onClick={() => navigate(`/nurse-patient-details/${task.patientId}`)}
                            >
                                <div className="flex-1 text-sm">
                                    <p className="text-gray-800 font-medium">{task.patientName}</p>
                                    <p className="text-gray-600">{task.taskDescription}</p>
                                </div>
                                <div>
                                    <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                                        Due: {formatDate(task.dueDate)}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-4 text-gray-500">No pending tasks</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NurseDashboard;

