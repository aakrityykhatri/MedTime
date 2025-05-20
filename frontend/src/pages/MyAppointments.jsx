import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const MyAppointments = () => {
    const { backendUrl, token, getDoctorsData } = useContext(AppContext);
    const [appointments, setAppointments] = useState([]);
    const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
    const [loading, setLoading] = useState(false);
    const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split("_");
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
    };

    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + "/api/user/appointments", { headers: { token } });
            if (data.success) {
                setAppointments(data.appointments.reverse());
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const getDiagnosis = async (appointmentId) => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/user/get-diagnosis`,
                { appointmentId },
                { headers: { token } }
            );
    
            if (response.data.success) {
                setSelectedDiagnosis(response.data.diagnosis);
                if (response.data.diagnosis) {
                    toast.success("Diagnosis loaded successfully");
                }
            } else {
                toast.error(response.data.message || "No diagnosis found");
            }
        } catch (error) {
            console.error("Error fetching diagnosis:", error);
            toast.error(error.response?.data?.message || "Error fetching diagnosis");
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            const {data} = await axios.post(backendUrl + '/api/user/cancel-appointment', {appointmentId}, {headers: {token}})
    
            if (data.success) {
                toast.success(data.message)
                getUserAppointments()
                getDoctorsData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message) 
        }
    };

    const payOnline = async (appointmentId) => {
        try {
            setLoading(true);
            console.log("Initiating payment for:", appointmentId);
    
            const { data } = await axios.post(
                `${backendUrl}/api/payment/create-payment-intent`,
                { appointmentId },
                { 
                    headers: { 
                        token,
                        'Content-Type': 'application/json'
                    } 
                }
            );
    
            console.log("Payment response:", data);
    
            if (data.success && data.sessionId) {
                const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
                
                const { error } = await stripe.redirectToCheckout({
                    sessionId: data.sessionId
                });
    
                if (error) {
                    throw new Error(error.message);
                }
            } else {
                throw new Error(data.message || "Payment initiation failed");
            }
    
        } catch (error) {
            console.error("Payment error:", error);
            toast.error(error.message || "Payment processing failed");
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        if (token) {
            getUserAppointments();
        }
    }, [token]);

    return (
        <div>
            <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My appointments</p>
            <div>
                {appointments.map((item, index) => (
                    <div className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b" key={index}>
                        <div>
                            <img className="w-32 bg-indigo-50" src={item.docData.image} alt="" />
                        </div>
                        <div className="flex-1 text-sm text-zinc-600">
                            <p className="text-neutral-800 font-semibold">{item.docData.name}</p>
                            <p>{item.docData.speciality}</p>
                            <p className="text-zinc-700 font-medium mt-1">Address</p>
                            <p className="text-xs">{item.docData.address.line1}</p>
                            <p className="text-xs">{item.docData.address.line2}</p>
                            <p className="text-sm mt-1">
                                <span className="text-sm text-neutral-700 font-medium">Date & Time:</span>{" "}
                                {slotDateFormat(item.slotDate)} | {item.slotTime}
                            </p>
                            <p className="text-sm mt-1 text-green-700 font-semibold">Price: USD {item.fee}</p>
                        </div>
                        <div className="flex flex-col gap-2 justify-end">
                            {/* Show Diagnosis button only if appointment is completed */}
                            {item.isCompleted && (
                                <button
                                    onClick={() => getDiagnosis(item._id)}
                                    className="text-sm text-primary text-center sm:min-w-48 py-2 border hover:bg-primary hover:text-white transition-all duration-300"
                                >
                                    View Diagnosis
                                </button>
                            )}
                            
                            {/* Payment Status Display */}
                            {item.paymentStatus === "Completed" ? (
                                <div className="text-sm text-green-600 text-center sm:min-w-48 py-2 border">
                                    Payment Completed ({item.paymentMethod})
                                </div>
                            ) : (
                                /* Show Pay Online button only if not paid and not cancelled */
                                !item.cancelled && (
                                    <button
                                        onClick={() => payOnline(item._id)}
                                        disabled={loading}
                                        className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-primary hover:text-white transition-all duration-300"
                                    >
                                        {loading ? 'Processing...' : 'Pay Online'}
                                    </button>
                                )
                            )}

                            {/* Cancel Button */}
                            {!item.cancelled && !item.isCompleted && item.paymentStatus !== "Completed" && (
                                <button
                                    onClick={() => cancelAppointment(item._id)}
                                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-300"
                                >
                                    Cancel appointment
                                </button>
                            )}

                            {/* Cancelled Status */}
                            {item.cancelled && (
                                <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                                    Appointment cancelled
                                </button>
                            )}
                        </div>

                    </div>
                ))}
            </div>

            {/* Diagnosis Modal */}
            {selectedDiagnosis && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Diagnosis Details</h2>
                            <button
                                onClick={() => setSelectedDiagnosis(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="font-medium mb-2">Diagnosis</h3>
                                <p className="p-3 bg-gray-50 rounded">{selectedDiagnosis.diagnosis}</p>
                            </div>

                            <div>
                                <h3 className="font-medium mb-2">Prescription</h3>
                                <p className="p-3 bg-gray-50 rounded">{selectedDiagnosis.prescription}</p>
                            </div>

                            {selectedDiagnosis.medicines?.length > 0 && (
                                <div>
                                    <h3 className="font-medium mb-2">Medicines</h3>
                                    <div className="border rounded overflow-hidden">
                                        <div className="grid grid-cols-4 gap-4 bg-gray-50 p-3 font-medium">
                                            <p>Medicine</p>
                                            <p>Dosage</p>
                                            <p>Duration</p>
                                            <p>Timing</p>
                                        </div>
                                        {selectedDiagnosis.medicines.map((medicine, index) => (
                                            <div key={index} className="grid grid-cols-4 gap-4 p-3 border-t">
                                                <p>{medicine.name}</p>
                                                <p>{medicine.dosage}</p>
                                                <p>{medicine.duration}</p>
                                                <p>{medicine.timing}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedDiagnosis.followUpDate && (
                                <div>
                                    <h3 className="font-medium mb-2">Follow-up Date</h3>
                                    <p className="p-3 bg-gray-50 rounded">
                                        {new Date(selectedDiagnosis.followUpDate).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => setSelectedDiagnosis(null)}
                                className="px-6 py-2 border rounded hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyAppointments;
