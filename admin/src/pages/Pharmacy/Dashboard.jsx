import { useContext, useEffect } from "react"
import { PharmacyContext } from "../../context/PharmacyContext"
import { assets } from "../../assets/assets"

const PharmacyDashboard = () => {
    const { dashData, getDashboardData } = useContext(PharmacyContext)

    useEffect(() => {
        getDashboardData()
    }, [])

    if (!dashData) {
        return <div className="m-5">Loading...</div>
    }

    return (
        <div className="m-5">
            <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
                    <img className="w-14" src={assets.prescription_icon} alt="" />
                    <div>
                        <p className="text-xl font-semibold text-gray-600">{dashData.pendingPrescriptions || 0}</p>
                        <p className="text-gray-400">Pending Prescriptions</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
                    <img className="w-14" src={assets.completed_icon} alt="" />
                    <div>
                        <p className="text-xl font-semibold text-gray-600">{dashData.completedPrescriptions || 0}</p>
                        <p className="text-gray-400">Completed</p>
                    </div>
                </div>
            </div>

            <div className="bg-white mt-8 rounded-lg shadow">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Recent Prescriptions</h2>
                </div>
                <div className="p-4">
                    {dashData.recentPrescriptions && dashData.recentPrescriptions.length > 0 ? (
                        dashData.recentPrescriptions.map((prescription, index) => (
                            <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                                <div className="flex items-center gap-3">
                                    {prescription.userData && (
                                        <img 
                                            className="w-10 h-10 rounded-full object-cover" 
                                            src={prescription.userData.image || assets.profile_pic} 
                                            alt="" 
                                        />
                                    )}
                                    <div>
                                        <p className="font-medium">
                                            {prescription.userData?.name || 'Unknown Patient'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Dr. {prescription.docData?.name || 'Unknown Doctor'}
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm ${
                                    prescription.dispensingStatus === 'completed' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {prescription.dispensingStatus || 'pending'}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">No recent prescriptions</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PharmacyDashboard
