import express from 'express'
import { addDoctor,allDoctors,loginAdmin,appointmentsAdmin,appointmentCancel,adminDashboard,addPharmacy,getAllPharmacies,changePharmacyAvailability,addNurse,getAllNurses,changeNurseAvailability } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'
import { changeAvailablity } from '../controllers/doctorController.js'

const adminRouter = express.Router()

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-availablity',authAdmin,changeAvailablity)
adminRouter.get('/appointments',authAdmin,appointmentsAdmin)
adminRouter.post('/cancel-appointment',authAdmin,appointmentCancel)
adminRouter.get('/dashboard',authAdmin,adminDashboard)
adminRouter.post('/add-pharmacy', authAdmin, upload.single('image'), addPharmacy)
adminRouter.get('/all-pharmacies', authAdmin, getAllPharmacies)
adminRouter.post('/change-pharmacy-availability', authAdmin, changePharmacyAvailability)
adminRouter.post('/add-nurse', authAdmin, upload.single('image'), addNurse);
adminRouter.get('/all-nurses', authAdmin, getAllNurses);
adminRouter.post('/change-nurse-availability', authAdmin, changeNurseAvailability);

export default adminRouter