import { useContext, useEffect, useState, useRef } from "react";
import { NurseContext } from "../../context/NurseContext";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useReactToPrint } from 'react-to-print';

const PrescriptionPrint = () => {
    const { nToken, backendUrl } = useContext(NurseContext);
    const [loading, setLoading] = useState(true);
    const [prescription, setPrescription] = useState(null);
    const { prescriptionId } = useParams();
    const navigate = useNavigate();
    const printRef = useRef();

    useEffect(() => {
        if (nToken && prescriptionId) {
            fetchPrescriptionDetails();
        }
    }, [nToken, prescriptionId]);

    const fetchPrescriptionDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${backendUrl}/api/nurse/prescriptions/${prescriptionId}`, {
                headers: {
                    ntoken: nToken
                }
            });
            const data = await response.json();

            if (data.success) {
                setPrescription(data.prescription);
            } else {
                console.error("Failed to fetch prescription details:", data.message);
                toast.error("Failed to load prescription details");
            }
        } catch (error) {
            console.error("Error fetching prescription details:", error);
            toast.error("An error occurred while loading prescription details");
        } finally {
            setLoading(false);
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

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: `Prescription_${prescriptionId.substring(0, 8)}`,
        onAfterPrint: () => toast.success("Prescription printed successfully")
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!prescription) {
        return (
            <div className="m-5 text-center">
                <p className="text-lg text-gray-600">Prescription not found</p>
                <button
                    onClick={() => navigate('/nurse-prescriptions')}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                    Back to Prescriptions
                </button>
            </div>
        );
    }

    return (
        <div className="m-5">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-medium">Printable Prescription</h1>
                <button
                    onClick={() => navigate('/nurse-prescriptions')}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                    Back to Prescriptions
                </button>
            </div>

            <div ref={printRef} className="bg-white p-6 rounded-lg shadow" style={{ fontFamily: 'Arial, sans-serif' }}>
                {/* Header */}
                <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold">MedTime Hospital</h2>
                    <p className="text-gray-600">Prescription #{prescription._id.substring(0, 8)}</p>
                    <p className="text-sm text-gray-500">Date: {formatDate(prescription.date)}</p>
                </div>

                {/* Patient & Doctor Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <h3 className="text-lg font-semibold">Patient Information</h3>
                        <p>Name: {prescription.userData?.name || "Unknown Patient"}</p>
                        <p>Gender: {prescription.userData?.gender}</p>
                        <p>Age: {prescription.userData?.age} years</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Doctor Information</h3>
                        <p>Name: Dr. {prescription.docData?.name || "Unknown Doctor"}</p>
                        <p>Speciality: {prescription.docData?.speciality || ""}</p>
                    </div>
                </div>

                {/* Diagnosis */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Diagnosis</h3>
                    <p>{prescription.diagnosis || "No diagnosis provided"}</p>
                </div>

                {/* Prescription Notes */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Prescription Notes</h3>
                    <p>{prescription.prescription || "No prescription notes provided"}</p>
                </div>

                {/* Medicines */}
                <div>
                    <h3 className="text-lg font-semibold">Medicines</h3>
                    {prescription.medicines && prescription.medicines.length > 0 ? (
                        <ul className="list-disc list-inside">
                            {prescription.medicines.map((medicine, index) => (
                                <li key={index}>
                                    {medicine.name} - {medicine.dosage}, {medicine.timing} for {medicine.duration}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No medicines prescribed</p>
                    )}
                </div>
            </div>

            <div className="flex justify-center mt-6">
                <button
                    onClick={handlePrint}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                    Print Prescription
                </button>
            </div>
        </div>
    );
};

export default PrescriptionPrint;