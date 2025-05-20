import { useContext, useEffect, useState } from "react"
import { DoctorContext } from "../../context/DoctorContext"
import { AppContext } from "../../context/AppContext"
import { assets } from "../../assets/assets"
import DiagnosisModal from "../../components/Doctor/DiagnosisModal"
import ViewDiagnosisModal from '../../components/Doctor/ViewDiagnosisModal'
import axios from 'axios'

const DoctorAppointments = () => {
  const {dToken, appointments, getAppointments, completeAppointment, cancelAppointment, backendUrl} = useContext(DoctorContext)
  const {calculateAge, slotDateFormat, currency} = useContext(AppContext)
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  },[dToken])

  const handleAppointmentClick = async (appointment, isCompleted = false) => {
    try {
      // Check if diagnosis exists
      const response = await axios.post(`${backendUrl}/api/doctor/get-diagnosis`, 
        { appointmentId: appointment._id },
        { headers: { dToken } }
      );
      
      setSelectedAppointment(appointment);
      setIsViewMode(response.data.success || isCompleted);
    } catch (error) {
      console.error(error);
      setSelectedAppointment(appointment);
      setIsViewMode(isCompleted);
    }
  };

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll">
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {appointments.reverse().map((item,index)=>(
          <div className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50" key={index}>
            <p className="max-sm:hidden">{index+1}</p>
            <div className="flex items-center gap-2">
              <img className="w-8 rounded-full" src={item.userData.image} alt="" /> 
              <p>{item.userData.name}</p>
            </div>
            <div>
              <p className="text-xs inline border border-primary px-2 rounded-full">
                  {item.paymentMethod === 'ONLINE' ? 'ONLINE' : 'CASH'}
              </p>
            </div>
            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
            <p>{currency}{item.amount}</p>
            {item.cancelled ? (
              <p className="text-red-400 text-xs font-medium">Cancelled</p>
            ) : item.isCompleted ? (
              <div className="flex gap-2">
                <p className="text-green-500 text-xs font-medium">Completed</p>
                <button
                  onClick={() => handleAppointmentClick(item, true)}
                  className="text-primary text-xs underline hover:text-primary/80"
                >
                  View Diagnosis
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => handleAppointmentClick(item, false)}
                  className="px-3 py-1 text-xs bg-primary text-white rounded hover:bg-primary/90"
                >
                  Diagnose
                </button>
                <img onClick={() => cancelAppointment(item._id)} className="w-8 cursor-pointer" src={assets.cancel_icon} alt="" />
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedAppointment && (
        isViewMode ? (
          <ViewDiagnosisModal
            appointment={selectedAppointment}
            onClose={() => {
              setSelectedAppointment(null);
              setIsViewMode(false);
            }}
            dToken={dToken}
            backendUrl={backendUrl}
          />
        ) : (
          <DiagnosisModal
            appointment={selectedAppointment}
            onClose={() => {
              setSelectedAppointment(null);
              setIsViewMode(false);
            }}
            dToken={dToken}
            backendUrl={backendUrl}
            onDiagnosisComplete={() => {
              getAppointments();
              setSelectedAppointment(null);
              setIsViewMode(false);
            }}
          />
        )
      )}
    </div>
  )
}

export default DoctorAppointments
