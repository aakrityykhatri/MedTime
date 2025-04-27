import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ViewDiagnosisModal = ({ appointment, onClose, dToken, backendUrl }) => {
    const [diagnosis, setDiagnosis] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDiagnosis();
    }, []);

    const fetchDiagnosis = async () => {
        try {
            const response = await axios.post(`${backendUrl}/api/doctor/get-diagnosis`, 
                { appointmentId: appointment._id },
                { headers: { dToken } }
            );

            if (response.data.success) {
                setDiagnosis(response.data.diagnosis);
            } else {
                toast.error("Failed to fetch diagnosis details");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error loading diagnosis details");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6">
                    <p className="text-gray-700">Loading diagnosis details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Diagnosis Details</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-500 hover:text-gray-700 text-xl"
                    >
                        ×
                    </button>
                </div>

                {/* Patient Information */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="text-md font-medium mb-3 text-gray-800">Patient Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-600">Name</p>
                            <p className="font-medium">{appointment.userData.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Appointment Date</p>
                            <p className="font-medium">{appointment.slotDate}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Time</p>
                            <p className="font-medium">{appointment.slotTime}</p>
                        </div>
                    </div>
                </div>

                {/* Diagnosis Content */}
                <div className="space-y-6">
                    {/* Diagnosis */}
                    <div>
                        <h3 className="text-md font-medium mb-2 text-gray-800">Diagnosis</h3>
                        <div className="p-3 bg-gray-50 rounded-lg text-gray-700">
                            {diagnosis?.diagnosis}
                        </div>
                    </div>

                    {/* Prescription */}
                    <div>
                        <h3 className="text-md font-medium mb-2 text-gray-800">Prescription</h3>
                        <div className="p-3 bg-gray-50 rounded-lg text-gray-700">
                            {diagnosis?.prescription}
                        </div>
                    </div>

                    {/* Medicines */}
                    {diagnosis?.medicines?.length > 0 && (
                        <div>
                            <h3 className="text-md font-medium mb-2 text-gray-800">Medicines</h3>
                            <div className="border rounded-lg overflow-hidden">
                                <div className="grid grid-cols-4 bg-gray-50 p-3 text-sm font-medium text-gray-700">
                                    <div>Medicine Name</div>
                                    <div>Dosage</div>
                                    <div>Duration</div>
                                    <div>Timing</div>
                                </div>
                                {diagnosis.medicines.map((medicine, index) => (
                                    <div 
                                        key={index} 
                                        className={`grid grid-cols-4 p-3 text-sm text-gray-600 ${
                                            index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                        }`}
                                    >
                                        <div>{medicine.name}</div>
                                        <div>{medicine.dosage}</div>
                                        <div>{medicine.duration}</div>
                                        <div>{medicine.timing}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tests */}
                    {diagnosis?.tests?.length > 0 && (
                        <div>
                            <h3 className="text-md font-medium mb-2 text-gray-800">Medical Tests</h3>
                            <div className="border rounded-lg overflow-hidden">
                                <div className="grid grid-cols-2 bg-gray-50 p-3 text-sm font-medium text-gray-700">
                                    <div>Test Name</div>
                                    <div>Description</div>
                                </div>
                                {diagnosis.tests.map((test, index) => (
                                    <div 
                                        key={index} 
                                        className={`grid grid-cols-2 p-3 text-sm text-gray-600 ${
                                            index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                        }`}
                                    >
                                        <div>{test.name}</div>
                                        <div>{test.description}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Follow-up Date */}
                    {diagnosis?.followUpDate && (
                        <div>
                            <h3 className="text-md font-medium mb-2 text-gray-800">Follow-up Date</h3>
                            <div className="p-3 bg-gray-50 rounded-lg text-gray-700">
                                {new Date(diagnosis.followUpDate).toLocaleDateString()}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewDiagnosisModal;
