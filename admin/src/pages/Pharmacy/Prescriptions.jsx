import { useContext, useEffect } from "react"
import { PharmacyContext } from "../../context/PharmacyContext"
import { assets } from "../../assets/assets" // Make sure to import assets

const Prescriptions = () => {
    const { prescriptions, getPrescriptions, updatePrescriptionStatus } = useContext(PharmacyContext)

    useEffect(() => {
        getPrescriptions()
    }, [])

    const handleStatusUpdate = (prescriptionId, status) => {
        if(confirm(`Are you sure you want to mark this prescription as ${status}?`)) {
            updatePrescriptionStatus(prescriptionId, status)
        }
    }

    return (
        <div className="m-5 w-full max-w-6xl">
            <p className="mb-3 text-lg font-medium">Prescriptions Management</p>

            <div className="bg-white border rounded text-sm">
                <div className="grid grid-cols-[2fr_2fr_2fr_1fr_1fr] gap-4 py-3 px-6 border-b font-medium">
                    <p>Patient Details</p>
                    <p>Doctor</p>
                    <p>Medicines</p>
                    <p>Status</p>
                    <p>Actions</p>
                </div>

                {prescriptions && prescriptions.map((prescription, index) => (
                    <div key={index} className="grid grid-cols-[2fr_2fr_2fr_1fr_1fr] gap-4 items-center py-4 px-6 border-b hover:bg-gray-50">
                        <div className="flex items-center gap-2">
                            <img 
                                className="w-8 rounded-full" 
                                src={prescription.userData?.image || assets.profile_pic} 
                                alt="" 
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = assets.profile_pic;
                                }}
                            />
                            <div>
                                <p className="text-neutral-800 font-medium">
                                    {prescription.userData?.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {new Date(prescription.date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <img 
                                className="w-8 rounded-full bg-gray-200" 
                                src={prescription.docData?.image || assets.doctor_pic} 
                                alt="" 
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = assets.doctor_pic;
                                }}
                            />
                            <div>
                                <p className="text-neutral-800 font-medium">
                                    Dr. {prescription.docData?.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {prescription.docData?.speciality}
                                </p>
                            </div>
                        </div>

                        <div className="text-sm">
                            {prescription.medicines && prescription.medicines.map((medicine, idx) => (
                                <div key={idx} className="mb-1">
                                    <p className="font-medium">{medicine.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {medicine.dosage} - {medicine.timing}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                                prescription.dispensingStatus === 'completed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : prescription.dispensingStatus === 'cancelled'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {prescription.dispensingStatus}
                            </span>
                        </div>

                        <div className="flex gap-2">
                            {prescription.dispensingStatus === 'pending' && (
                                <>
                                    <img 
                                        onClick={() => handleStatusUpdate(prescription._id, 'completed')}
                                        className="w-10 cursor-pointer" 
                                        src={assets.tick_icon} 
                                        alt="Accept" 
                                    />
                                    <img 
                                        onClick={() => handleStatusUpdate(prescription._id, 'cancelled')}
                                        className="w-10 cursor-pointer" 
                                        src={assets.cancel_icon} 
                                        alt="Reject" 
                                    />
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Prescriptions
