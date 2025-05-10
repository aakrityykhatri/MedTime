import express from 'express';
import {
    loginPharmacy,
    getPharmacyProfile,
    updatePharmacyProfile,
    getPendingPrescriptions,
    updatePrescriptionStatus,
    getDashboardData,
    updateDispensing,
    getPatientMedicineHistory
} from '../controllers/pharmacyController.js';
import authPharmacy from '../middlewares/authPharmacy.js';

const pharmacyRouter = express.Router();

// Public routes
pharmacyRouter.post('/login', loginPharmacy);

// Protected routes
pharmacyRouter.get('/profile', authPharmacy, getPharmacyProfile);
pharmacyRouter.post('/update-profile', authPharmacy, updatePharmacyProfile);
pharmacyRouter.get('/prescriptions', authPharmacy, getPendingPrescriptions);
pharmacyRouter.post('/update-prescription', authPharmacy, updatePrescriptionStatus);
pharmacyRouter.get('/dashboard', authPharmacy, getDashboardData);
pharmacyRouter.post('/update-dispensing', authPharmacy, updateDispensing);
pharmacyRouter.get('/patient-history', authPharmacy, getPatientMedicineHistory);

export default pharmacyRouter;
