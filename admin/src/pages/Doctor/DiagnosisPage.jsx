import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const DiagnosisPage = () => {
    const navigate = useNavigate();
    const { appointmentId } = useParams();
    const { dToken, backendUrl } = useContext(DoctorContext);
    const { slotDateFormat } = useContext(AppContext);
    
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        diagnosis: '',
        prescription: '',
        medicines: [{ name: '', dosage: '', duration: '', timing: '' }],
        tests: [{ name: '', description: '' }],
        followUpDate: ''
    });

    const getAppointmentDetails = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/doctor/appointments`, {
                headers: { dToken }
            });
            const appointmentData = response.data.appointments.find(
                app => app._id === appointmentId
            );
            setAppointment(appointmentData);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching appointment details');
        }
    };

    useEffect(() => {
        if (dToken && appointmentId) {
            getAppointmentDetails();
        }
    }, [dToken, appointmentId]);

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

    const handleMedicineChange = (index, field, value) => {
        const updatedMedicines = [...formData.medicines];
        updatedMedicines[index][field] = value;
        setFormData(prev => ({ ...prev, medicines: updatedMedicines }));
    };

    const handleTestChange = (index, field, value) => {
        const updatedTests = [...formData.tests];
        updatedTests[index][field] = value;
        setFormData(prev => ({ ...prev, tests: updatedTests }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await axios.post(`${backendUrl}/api/doctor/create-diagnosis`, {
                appointmentId,
                ...formData
            }, {
                headers: { dToken }
            });

            if (response.data.success) {
                toast.success('Diagnosis saved successfully');
                navigate('/doctor-appointments');
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
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-6">Create Diagnosis</h2>
                
                {appointment && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium mb-2">Patient Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Patient Name</p>
                                <p className="font-medium">{appointment.userData.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Appointment Date</p>
                                <p className="font-medium">
                                    {slotDateFormat(appointment.slotDate)} | {appointment.slotTime}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Diagnosis and Prescription Fields */}
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block mb-2 font-medium">Diagnosis</label>
                            <textarea
                                value={formData.diagnosis}
                                onChange={(e) => setFormData(prev => ({...prev, diagnosis: e.target.value}))}
                                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary/20"
                                rows="4"
                                required
                                placeholder="Enter diagnosis details..."
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Prescription Notes</label>
                            <textarea
                                value={formData.prescription}
                                onChange={(e) => setFormData(prev => ({...prev, prescription: e.target.value}))}
                                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary/20"
                                rows="4"
                                required
                                placeholder="Enter prescription details..."
                            />
                        </div>
                    </div>

                    {/* Medicines Section */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
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
                            <div key={index} className="grid grid-cols-4 gap-4 mb-4">
                                <input
                                    placeholder="Medicine name"
                                    value={medicine.name}
                                    onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                                    className="p-2 border rounded"
                                    required
                                />
                                <input
                                    placeholder="Dosage"
                                    value={medicine.dosage}
                                    onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                                    className="p-2 border rounded"
                                    required
                                />
                                <input
                                    placeholder="Duration"
                                    value={medicine.duration}
                                    onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                                    className="p-2 border rounded"
                                    required
                                />
                                <div className="flex gap-2">
                                    <input
                                        placeholder="Timing"
                                        value={medicine.timing}
                                        onChange={(e) => handleMedicineChange(index, 'timing', e.target.value)}
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
                        <div className="flex justify-between items-center mb-4">
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
                            <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                                <input
                                    placeholder="Test name"
                                    value={test.name}
                                    onChange={(e) => handleTestChange(index, 'name', e.target.value)}
                                    className="p-2 border rounded"
                                />
                                <div className="flex gap-2">
                                    <input
                                        placeholder="Description"
                                        value={test.description}
                                        onChange={(e) => handleTestChange(index, 'description', e.target.value)}
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
                        <label className="block mb-2 font-medium">
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

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Diagnosis'}
                        </button>
                        
                        <button
                            type="button"
                            onClick={() => navigate('/doctor-appointments')}
                            className="px-6 py-3 border rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DiagnosisPage;
