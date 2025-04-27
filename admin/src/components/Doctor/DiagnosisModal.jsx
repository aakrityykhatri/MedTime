import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DiagnosisModal = ({ appointment, onClose, dToken, backendUrl, onDiagnosisComplete }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        diagnosis: '',
        prescription: '',
        medicines: [{ name: '', dosage: '', duration: '', timing: '' }],
        tests: [{ name: '', description: '' }],
        followUpDate: ''
    });

    const addMedicine = () => {
        setFormData(prev => ({
            ...prev,
            medicines: [...prev.medicines, { name: '', dosage: '', duration: '', timing: '' }]
        }));
    };

    const removeMedicine = (index) => {
        setFormData(prev => ({
            ...prev,
            medicines: prev.medicines.filter((_, i) => i !== index)
        }));
    };

    const addTest = () => {
        setFormData(prev => ({
            ...prev,
            tests: [...prev.tests, { name: '', description: '' }]
        }));
    };

    const removeTest = (index) => {
        setFormData(prev => ({
            ...prev,
            tests: prev.tests.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await axios.post(`${backendUrl}/api/doctor/create-diagnosis`, {
                appointmentId: appointment._id,
                ...formData
            }, {
                headers: { dToken }
            });

            if (response.data.success) {
                toast.success('Diagnosis saved successfully');
                onDiagnosisComplete();
                onClose();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Error saving diagnosis');
        }
        
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Create Diagnosis</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ×
                    </button>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Patient Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Patient Name</p>
                            <p className="font-medium">{appointment.userData.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Appointment Date & Time</p>
                            <p className="font-medium">{appointment.slotDate}, {appointment.slotTime}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Diagnosis and Prescription Fields */}
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block mb-1 font-medium">Diagnosis</label>
                            <textarea
                                value={formData.diagnosis}
                                onChange={(e) => setFormData(prev => ({...prev, diagnosis: e.target.value}))}
                                className="w-full p-2 border rounded"
                                rows="3"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Prescription</label>
                            <textarea
                                value={formData.prescription}
                                onChange={(e) => setFormData(prev => ({...prev, prescription: e.target.value}))}
                                className="w-full p-2 border rounded"
                                rows="3"
                                required
                            />
                        </div>
                    </div>

                    {/* Medicines Section */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="font-medium">Medicines</label>
                            <button
                                type="button"
                                onClick={addMedicine}
                                className="text-primary text-sm hover:underline"
                            >
                                + Add Medicine
                            </button>
                        </div>
                        {formData.medicines.map((medicine, index) => (
                            <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                                <input
                                    placeholder="Medicine name"
                                    value={medicine.name}
                                    onChange={(e) => {
                                        const updatedMedicines = [...formData.medicines];
                                        updatedMedicines[index].name = e.target.value;
                                        setFormData(prev => ({...prev, medicines: updatedMedicines}));
                                    }}
                                    className="p-2 border rounded"
                                    required
                                />
                                <input
                                    placeholder="Dosage"
                                    value={medicine.dosage}
                                    onChange={(e) => {
                                        const updatedMedicines = [...formData.medicines];
                                        updatedMedicines[index].dosage = e.target.value;
                                        setFormData(prev => ({...prev, medicines: updatedMedicines}));
                                    }}
                                    className="p-2 border rounded"
                                    required
                                />
                                <input
                                    placeholder="Duration"
                                    value={medicine.duration}
                                    onChange={(e) => {
                                        const updatedMedicines = [...formData.medicines];
                                        updatedMedicines[index].duration = e.target.value;
                                        setFormData(prev => ({...prev, medicines: updatedMedicines}));
                                    }}
                                    className="p-2 border rounded"
                                    required
                                />
                                <div className="flex gap-2">
                                    <input
                                        placeholder="Timing"
                                        value={medicine.timing}
                                        onChange={(e) => {
                                            const updatedMedicines = [...formData.medicines];
                                            updatedMedicines[index].timing = e.target.value;
                                            setFormData(prev => ({...prev, medicines: updatedMedicines}));
                                        }}
                                        className="p-2 border rounded flex-1"
                                        required
                                    />
                                    {index > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => removeMedicine(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tests Section */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="font-medium">Medical Tests</label>
                            <button
                                type="button"
                                onClick={addTest}
                                className="text-primary text-sm hover:underline"
                            >
                                + Add Test
                            </button>
                        </div>
                        {formData.tests.map((test, index) => (
                            <div key={index} className="grid grid-cols-2 gap-2 mb-2">
                                <input
                                    placeholder="Test name"
                                    value={test.name}
                                    onChange={(e) => {
                                        const updatedTests = [...formData.tests];
                                        updatedTests[index].name = e.target.value;
                                        setFormData(prev => ({...prev, tests: updatedTests}));
                                    }}
                                    className="p-2 border rounded"
                                />
                                <div className="flex gap-2">
                                    <input
                                        placeholder="Description"
                                        value={test.description}
                                        onChange={(e) => {
                                            const updatedTests = [...formData.tests];
                                            updatedTests[index].description = e.target.value;
                                            setFormData(prev => ({...prev, tests: updatedTests}));
                                        }}
                                        className="p-2 border rounded flex-1"
                                    />
                                    {index > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => removeTest(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Follow-up Date */}
                    <div>
                        <label className="block mb-1 font-medium">
                            Follow-up Date (optional)
                        </label>
                        <input
                            type="date"
                            value={formData.followUpDate}
                            onChange={(e) => setFormData(prev => ({...prev, followUpDate: e.target.value}))}
                            className="p-2 border rounded w-full"
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Diagnosis'}
                        </button>
                        
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border rounded hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DiagnosisModal;
