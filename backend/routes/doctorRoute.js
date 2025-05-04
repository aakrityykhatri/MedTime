import express from 'express'
import { doctorList, loginDoctor, appointmentsDoctor, appointmentComplete, appointmentCancel, doctorDashboard, doctorProfile, updateDoctorProfile, createDiagnosis, getDiagnosis, getDiagnosisHistory, getCalendarEvents  } from '../controllers/doctorController.js'
import authDoctor from '../middlewares/authDoctor.js'

const doctorRouter = express.Router()

doctorRouter.get('/list',doctorList)
doctorRouter.post('/login',loginDoctor)
doctorRouter.get('/appointments',authDoctor,appointmentsDoctor)
doctorRouter.post('/complete-appointment',authDoctor,appointmentComplete)
doctorRouter.post('/cancel-appointment',authDoctor,appointmentCancel)
doctorRouter.get('/dashboard',authDoctor,doctorDashboard)
doctorRouter.get('/profile',authDoctor,doctorProfile)
doctorRouter.post('/update-profile',authDoctor,updateDoctorProfile)
doctorRouter.post('/create-diagnosis', authDoctor, createDiagnosis);
doctorRouter.post('/get-diagnosis', authDoctor, getDiagnosis);
doctorRouter.get('/diagnosis-history', authDoctor, getDiagnosisHistory);
doctorRouter.post('/calendar-events', authDoctor, getCalendarEvents);

export default doctorRouter;