import { useContext, useEffect, useState } from "react"
import { PharmacyContext } from "../../context/PharmacyContext"
import { toast } from "react-toastify"
import axios from "axios"

const PatientHistory = () => {
    const { pToken, backendUrl } = useContext(PharmacyContext)
    const [medicineHistory, setMedicineHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    // Add useEffect to fetch data when component mounts
    useEffect(() => {
        fetchMedicineHistory();
    }, []);

    const fetchMedicineHistory = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(
                `${backendUrl}/api/pharmacy/patient-history`,
                { headers: { ptoken: pToken } }
            );

            if (data.success) {
                setMedicineHistory(data.history);
                console.log("Medicine history:", data.history); // Debug log
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching history:", error);
            toast.error("Failed to load medicine history");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Loading state UI
    if (loading) {
        return (
            <div className="m-5">
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <p className="mt-4 text-gray-600">Loading patient history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="m-5 max-w-6xl">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">Patient Medicine History</h2>
                <div className="flex gap-4 items-center">
                    <input
                        type="text"
                        placeholder="Search by patient name..."
                        className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button 
                        onClick={fetchMedicineHistory}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
                {medicineHistory.length > 0 ? (
                    medicineHistory
                        .filter(record => 
                            record.patientName?.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((record, index) => (
                            <div key={record._id || index} className="border-b last:border-b-0 p-4 hover:bg-gray-50">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-medium text-lg">
                                            {record.patientName || 'Unknown Patient'}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Dr. {record.doctorName || 'Unknown Doctor'} - {record.doctorSpeciality || 'Specialist'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">
                                            Prescribed: {formatDate(record.date)}
                                        </p>
                                        {record.dispensedDate && (
                                            <p className="text-sm text-gray-600">
                                                Dispensed: {formatDate(record.dispensedDate)}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h4 className="font-medium mb-2">Medicines:</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {record.medicines?.map((medicine, idx) => (
                                            <div key={idx} className="bg-gray-50 p-3 rounded">
                                                <p className="font-medium">{medicine.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    {medicine.dosage} - {medicine.timing}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Duration: {medicine.duration}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-between items-center">
                                    <div className="text-sm">
                                        <span className={`px-2 py-1 rounded-full ${
                                            record.dispensingStatus === 'completed' 
                                                ? 'bg-green-100 text-green-800' 
                                                : record.dispensingStatus === 'cancelled'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {record.dispensingStatus || 'pending'}
                                        </span>
                                    </div>
                                    {record.refillsRemaining > 0 && (
                                        <p className="text-sm text-gray-600">
                                            Refills remaining: {record.refillsRemaining}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        <p className="text-lg">No medicine history found</p>
                        <p className="text-sm mt-2">Patient prescriptions will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientHistory;
