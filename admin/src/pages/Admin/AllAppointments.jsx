import { useContext, useEffect } from "react"
import { AdminContext } from "../../context/AdminContext"
import { AppContext } from "../../context/AppContext"
import { assets } from "../../assets/assets"

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext)
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">All Appointments</p>
      <div className="bg-white border rounded text-sm">
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1fr] py-3 px-6 border-b font-medium">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Status</p>
        </div>

        {appointments.map((item, index) => (
          <div 
            className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50" 
            key={index}
          >
            <p className="max-sm:hidden">{index + 1}</p>
            
            <div className="flex items-center gap-2">
              <img 
                className="w-8 rounded-full" 
                src={item.userData.image} 
                alt="" 
              /> 
              <p>{item.userData.name}</p>
            </div>

            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
            
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
            
            <div className="flex items-center gap-2">
              <img 
                className="w-8 rounded-full bg-gray-200" 
                src={item.docData.image} 
                alt="" 
              /> 
              <p>Dr. {item.docData.name}</p>
            </div>

            <p>{currency}{item.amount}</p>

            <div className="flex items-center gap-2">
            {item.cancelled ? (
                <span className="text-red-400 text-xs font-medium">Cancelled</span>
            ) : item.isCompleted ? (
                <div className="flex items-center gap-2">
                    <span className="text-green-500 text-xs font-medium">Completed</span>
                    {item.diagnosisCreated && (
                        <span className={`px-2 py-1 rounded-full text-xs ${
                            item.diagnosisStatus === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : item.diagnosisStatus === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                        }`}>
                            {item.diagnosisStatus}
                        </span>
                    )}
                </div>
            ) : (
                <img 
                    onClick={() => cancelAppointment(item._id)} 
                    className="w-10 cursor-pointer" 
                    src={assets.cancel_icon} 
                    alt="" 
                />
            )}
        </div>
    </div>
))}
      </div>
    </div>
  )
}

export default AllAppointments
