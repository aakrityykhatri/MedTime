import { useContext, useEffect, useState } from "react";
import { NurseContext } from "../../context/NurseContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddPatient = () => {
    const { nToken, backendUrl } = useContext(NurseContext);
    const [loading, setLoading] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const navigate = useNavigate(); 

    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "Male",
        contactNumber: "",
        emergencyContact: {
            name: "",
            relationship: "",
            phone: ""
        },
        address: {
            line1: "",
            line2: "",
            city: "",
            state: "",
            zipCode: ""
        },
        medicalHistory: "",
        allergies: [],
        bloodType: "Unknown",
        bedNumber: "",
        wardNumber: "",
        assignedDoctor: "",
        status: "Admitted"  // Added default status
    });

    useEffect(() => {
        fetchDoctors();
    }, []);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleNestedChange = (category, field, value) => {
        setFormData({
            ...formData,
            [category]: {
                ...formData[category],
                [field]: value
            }
        });
    };

    const handleAllergiesChange = (e) => {
        const allergiesText = e.target.value;
        const allergiesArray = allergiesText.split(',').map(item => item.trim()).filter(item => item !== '');
        
        setFormData({
            ...formData,
            allergies: allergiesArray
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Convert nested objects to strings for form submission
            const submissionData = {
                ...formData,
                emergencyContact: JSON.stringify(formData.emergencyContact),
                address: JSON.stringify(formData.address),
                allergies: JSON.stringify(formData.allergies)
            };

            const response = await fetch(`${backendUrl}/api/nurse/patients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ntoken: nToken
                },
                body: JSON.stringify(submissionData)
            });

            const data = await response.json();
            
            if (data.success) {
                toast.success('Patient added successfully');
                navigate('/nurse-patients');
            } else {
                toast.error(data.message || 'Failed to add patient');
            }
        } catch (error) {
            console.error('Error adding patient:', error);
            toast.error('An error occurred while adding the patient');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="m-5">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-medium">Add New Patient</h1>
                <button 
                    onClick={() => navigate('/nurse-patients')}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                    Back to Patients
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <div className="md:col-span-2">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                Full Name *
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="name"
                                type="text"
                                placeholder="Patient's full name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">
                                Age *
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="age"
                                type="number"
                                placeholder="Age in years"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">
                                Gender *
                            </label>
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contactNumber">
                                Contact Number *
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="contactNumber"
                                type="text"
                                placeholder="Contact number"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bloodType">
                                Blood Type
                            </label>
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="bloodType"
                                name="bloodType"
                                value={formData.bloodType}
                                onChange={handleChange}
                            >
                                <option value="Unknown">Unknown</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>

                        {/* Hospital Information */}
                        <div className="md:col-span-2 mt-4">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Hospital Information</h2>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                                Status *
                            </label>
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="Admitted">Admitted</option>
                                <option value="To Be Discharged">To Be Discharged</option>
                                <option value="Discharged">Discharged</option>
                                <option value="Follow Up">Follow Up</option>
                                <option value="Checkup">Checkup</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="wardNumber">
                                Ward Number *
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="wardNumber"
                                type="text"
                                placeholder="Ward number"
                                name="wardNumber"
                                value={formData.wardNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bedNumber">
                                Bed Number *
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="bedNumber"
                                type="text"
                                placeholder="Bed number"
                                name="bedNumber"
                                value={formData.bedNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="assignedDoctor">
                                Assigned Doctor
                            </label>
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="assignedDoctor"
                                name="assignedDoctor"
                                value={formData.assignedDoctor}
                                onChange={handleChange}
                            >
                                <option value="">Select a doctor</option>
                                {doctors.map((doctor) => (
                                    <option key={doctor._id} value={doctor._id}>
                                        Dr. {doctor.name} ({doctor.speciality})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Emergency Contact */}
                        <div className="md:col-span-2 mt-4">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h2>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="emergencyContactName">
                                Contact Name *
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="emergencyContactName"
                                type="text"
                                placeholder="Emergency contact name"
                                value={formData.emergencyContact.name}
                                onChange={(e) => handleNestedChange('emergencyContact', 'name', e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="emergencyContactRelationship">
                                Relationship *
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="emergencyContactRelationship"
                                type="text"
                                placeholder="Relationship to patient"
                                value={formData.emergencyContact.relationship}
                                onChange={(e) => handleNestedChange('emergencyContact', 'relationship', e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="emergencyContactPhone">
                                Contact Phone *
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="emergencyContactPhone"
                                type="text"
                                placeholder="Emergency contact phone"
                                value={formData.emergencyContact.phone}
                                onChange={(e) => handleNestedChange('emergencyContact', 'phone', e.target.value)}
                                required
                            />
                        </div>

                        {/* Address */}
                        <div className="md:col-span-2 mt-4">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Address</h2>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="addressLine1">
                                Address Line 1 *
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="addressLine1"
                                type="text"
                                placeholder="Street address"
                                value={formData.address.line1}
                                onChange={(e) => handleNestedChange('address', 'line1', e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="addressLine2">
                                Address Line 2
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="addressLine2"
                                type="text"
                                placeholder="Apartment, suite, etc. (optional)"
                                value={formData.address.line2}
                                onChange={(e) => handleNestedChange('address', 'line2', e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                                City *
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="city"
                                type="text"
                                placeholder="City"
                                value={formData.address.city}
                                onChange={(e) => handleNestedChange('address', 'city', e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="state">
                                State *
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="state"
                                type="text"
                                placeholder="State/Province"
                                value={formData.address.state}
                                onChange={(e) => handleNestedChange('address', 'state', e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="zipCode">
                                Zip/Postal Code *
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="zipCode"
                                type="text"
                                placeholder="Zip/Postal code"
                                value={formData.address.zipCode}
                                onChange={(e) => handleNestedChange('address', 'zipCode', e.target.value)}
                                required
                            />
                        </div>

                        {/* Medical Information */}
                        <div className="md:col-span-2 mt-4">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Medical Information</h2>
                        </div>

                        <div className="mb-4 md:col-span-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="medicalHistory">
                                Medical History
                            </label>
                            <textarea
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="medicalHistory"
                                placeholder="Patient's medical history"
                                name="medicalHistory"
                                value={formData.medicalHistory}
                                onChange={handleChange}
                                rows="4"
                            ></textarea>
                        </div>

                        <div className="mb-4 md:col-span-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="allergies">
                                Allergies (comma-separated)
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="allergies"
                                type="text"
                                placeholder="e.g., Penicillin, Peanuts, Latex"
                                value={formData.allergies.join(', ')}
                                onChange={handleAllergiesChange}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end mt-8">
                        <button
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={() => navigate('/nurse-patients')}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Add Patient'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPatient;
