import express from 'express';
import { 
    loginNurse, 
    getNurseProfile, 
    updateNurseProfile,
    changeAvailability,
    getNurseDashboard,
    getNursePatients,
    addPatient,
    updatePatient,
    getPatientDetails,
    addVitalSigns,
    addMedication,
    addLabReport,
    verifyLabReport,
    addNurseNote,
    recordRoundVisit,
    addFollowUpTask,
    completeFollowUpTask,
    getAllDoctors,
    assignDoctor
} from '../controllers/nurseController.js';
import authNurse from '../middlewares/authNurse.js';
import upload from '../middlewares/multer.js';

const nurseRouter = express.Router();

// Public routes
nurseRouter.post('/login', loginNurse);

// Protected routes
nurseRouter.get('/profile', authNurse, getNurseProfile);
nurseRouter.post('/update-profile', authNurse, upload.single('image'), updateNurseProfile);
nurseRouter.post('/change-availability', authNurse, changeAvailability);

// Dashboard
nurseRouter.get('/dashboard', authNurse, getNurseDashboard);

// Patient management
nurseRouter.get('/patients', authNurse, getNursePatients);
nurseRouter.post('/patients', authNurse, addPatient);
nurseRouter.get('/patients/:patientId', authNurse, getPatientDetails);
nurseRouter.put('/patients/:patientId', authNurse, updatePatient);

// Vital signs
nurseRouter.post('/patients/:patientId/vitals', authNurse, addVitalSigns);

// Medications
nurseRouter.post('/patients/:patientId/medications', authNurse, addMedication);

// Lab reports
nurseRouter.post('/patients/:patientId/lab-reports', authNurse, addLabReport);
nurseRouter.post('/patients/:patientId/lab-reports/:reportId/verify', authNurse, verifyLabReport);

// Nurse notes
nurseRouter.post('/patients/:patientId/notes', authNurse, addNurseNote);

// Hospital rounds
nurseRouter.post('/patients/:patientId/rounds', authNurse, recordRoundVisit);

// Follow-up tasks
nurseRouter.post('/patients/:patientId/tasks', authNurse, addFollowUpTask);
nurseRouter.post('/patients/:patientId/tasks/:taskId/complete', authNurse, completeFollowUpTask);

// Doctor assignment
nurseRouter.get('/doctors', authNurse, getAllDoctors);
nurseRouter.post('/patients/:patientId/assign-doctor', authNurse, assignDoctor);

export default nurseRouter;
