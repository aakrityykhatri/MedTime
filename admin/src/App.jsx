import { useContext } from "react";
import Login from "./pages/Login"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";

// Admin Pages
import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from "./pages/Admin/AllAppointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";
import AddPharmacy from "./pages/Admin/AddPharmacy"; 
import PharmacyList from "./pages/Admin/PharmacyList";

// Doctor Pages
import { DoctorContext } from "./context/DoctorContext";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import DoctorProfile from "./pages/Doctor/DoctorProfile";
import CalendarPage from "./pages/Doctor/CalendarPage";

// Pharmacy Pages
import { PharmacyContext } from "./context/PharmacyContext"
import PharmacyDashboard from "./pages/Pharmacy/Dashboard"
import Prescriptions from "./pages/Pharmacy/Prescriptions"
import PharmacyLogin from "./pages/Pharmacy/Login"
import PharmacyProfile from "./pages/Pharmacy/Profile"
import PatientHistory from "./pages/Pharmacy/PatientHistory";

// Nurse Pages
import AddNurse from './pages/Admin/AddNurse';
import NurseList from './pages/Admin/NurseList';
import { NurseContext } from "./context/NurseContext";
import NurseDashboard from "./pages/Nurse/NurseDashboard";
import NursePatients from "./pages/Nurse/NursePatients";
import AddPatient from "./pages/Nurse/AddPatient";
import PatientDetails from "./pages/Nurse/PatientDetails";
import EditPatient from "./pages/Nurse/EditPatient";
import LabReports from "./pages/Nurse/LabReports";
import HospitalRounds from "./pages/Nurse/HospitalRounds";
import PrescriptionPrint from "./pages/Nurse/PrescriptionPrint";

const App = () => {
  const {aToken} = useContext(AdminContext)
  const {dToken} = useContext(DoctorContext)
  const {pToken} = useContext(PharmacyContext)
  const {nToken} = useContext(NurseContext) 

  // Determine which login page to show
  const LoginComponent = () => {
    if (window.location.pathname === '/pharmacy-login') {
      return <PharmacyLogin />
    }
    return <Login />
  }

  return (aToken || dToken || pToken || nToken) ? (
    <div className="bg-[#F8F9FD]">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          {/* Admin Routes */}
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard/>} />
          <Route path="/all-appointments" element={<AllAppointments/>} />
          <Route path="/add-doctor" element={<AddDoctor/>} />
          <Route path="/doctor-list" element={<DoctorsList/>} />
          <Route path="/add-pharmacy" element={<AddPharmacy/>} />
          <Route path="/pharmacy-list" element={<PharmacyList/>} /> 

          {/* Doctor Routes */}
          <Route path="/doctor-dashboard" element={<DoctorDashboard/>} />
          <Route path="/doctor-appointments" element={<DoctorAppointments/>} />
          <Route path="/doctor-profile" element={<DoctorProfile/>} />
          <Route path="/doctor-calendar" element={<CalendarPage />} />

          {/* Pharmacy Routes */}
          <Route path="/pharmacy-dashboard" element={<PharmacyDashboard/>} />
          <Route path="/prescriptions" element={<Prescriptions/>} />
          <Route path="/pharmacy-profile" element={<PharmacyProfile/>} />
          <Route path="/patient-history" element={<PatientHistory />} />

          {/* Nurse Route */}
          <Route path="/add-nurse" element={<AddNurse />} />
          <Route path="/nurse-list" element={<NurseList />} />
          <Route path="/nurse-dashboard" element={<NurseDashboard />} />
          <Route path="/nurse-patients" element={<NursePatients />} />
          <Route path="/nurse-add-patient" element={<AddPatient />} />
          <Route path="/nurse-patient-details/:patientId" element={<PatientDetails />} />
          <Route path="/nurse-edit-patient/:patientId" element={<EditPatient />} />
          <Route path="/nurse-reports" element={<LabReports />} />
          <Route path="/nurse-rounds" element={<HospitalRounds />} />
          <Route path="/nurse-prescription-print/:prescriptionId" element={<PrescriptionPrint />} />

        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/pharmacy-login" element={<PharmacyLogin />} />
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
