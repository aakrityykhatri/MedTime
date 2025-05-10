import pharmacyModel from "../models/pharmacyModel.js";
import diagnosisModel from "../models/diagnosisModel.js";
import NotificationModel from "../models/notificationModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from "validator";

// Pharmacy Login
export const loginPharmacy = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login attempt for:", email); // Debug log

        const pharmacy = await pharmacyModel.findOne({ email });
        if (!pharmacy) {
            return res.json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, pharmacy.password);
        if (isMatch) {
            const token = jwt.sign(
                { id: pharmacy._id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );
            
            console.log("Generated token:", token); // Debug log
            
            res.json({
                success: true,
                token,
                pharmacy: {
                    _id: pharmacy._id,
                    name: pharmacy.name,
                    email: pharmacy.email,
                    image: pharmacy.image
                }
            });
        } else {
            res.json({
                success: false,
                message: "Invalid Credentials"
            });
        }
    } catch (error) {
        console.log("Login error:", error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Get Pharmacy Profile
export const getPharmacyProfile = async (req, res) => {
    try {
        const { pharmacyId } = req.body;
        console.log("Fetching profile for pharmacy:", pharmacyId); // Debug log

        const pharmacy = await pharmacyModel.findById(pharmacyId)
            .select('-password');

        if (!pharmacy) {
            return res.json({
                success: false,
                message: "Pharmacy not found"
            });
        }

        res.json({
            success: true,
            pharmacy
        });
    } catch (error) {
        console.log("Error fetching pharmacy profile:", error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Update Pharmacy Profile
export const updatePharmacyProfile = async (req, res) => {
    try {
        const { pharmacyId, name, phone, address, about } = req.body;
        await pharmacyModel.findByIdAndUpdate(pharmacyId, {
            name,
            phone,
            address,
            about
        });
        res.json({
            success: true,
            message: "Profile Updated Successfully"
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Get Pending Prescriptions
export const getPendingPrescriptions = async (req, res) => {
    try {
        const prescriptions = await diagnosisModel.find({
            dispensingStatus: { $ne: 'completed' }
        })
        .populate('userId')
        .populate('docId')
        .sort({ date: -1 });

        res.json({
            success: true,
            prescriptions
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Update Prescription Status
export const updatePrescriptionStatus = async (req, res) => {
    try {
        const { pharmacyId, prescriptionId, status } = req.body;

        // Update prescription status
        await diagnosisModel.findByIdAndUpdate(prescriptionId, {
            dispensingStatus: status
        });

        // Add to pharmacy's dispensing history
        await pharmacyModel.findByIdAndUpdate(pharmacyId, {
            $push: {
                dispensingHistory: {
                    prescriptionId,
                    status,
                    dispensedAt: Date.now()
                }
            }
        });

        res.json({
            success: true,
            message: "Status Updated Successfully"
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Get Dashboard Data
export const getDashboardData = async (req, res) => {
    try {
        const { pharmacyId } = req.body;

        // Get all prescriptions
        const allPrescriptions = await diagnosisModel.find()
            .populate('userId')
            .populate('docId')
            .sort({ date: -1 });

        const pendingCount = allPrescriptions.filter(p => p.dispensingStatus === 'pending').length;
        const completedCount = allPrescriptions.filter(p => p.dispensingStatus === 'completed').length;

        // Get recent prescriptions (last 5)
        const recentPrescriptions = allPrescriptions.slice(0, 5).map(prescription => ({
            _id: prescription._id,
            dispensingStatus: prescription.dispensingStatus,
            userData: prescription.userId ? {
                name: prescription.userId.name,
                image: prescription.userId.image
            } : null,
            docData: prescription.docId ? {
                name: prescription.docId.name
            } : null,
            date: prescription.date
        }));

        const dashData = {
            pendingPrescriptions: pendingCount,
            completedPrescriptions: completedCount,
            recentPrescriptions
        };

        res.json({
            success: true,
            dashData
        });
    } catch (error) {
        console.log("Dashboard error:", error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

export const getPrescriptions = async (req, res) => {
    try {
        // First, find all diagnoses and populate the related data
        const prescriptions = await diagnosisModel.find()
            .populate({
                path: 'appointmentId',
                populate: [
                    {
                        path: 'userData',
                        select: 'name image'
                    },
                    {
                        path: 'docData',
                        select: 'name image speciality'
                    }
                ]
            })
            .populate('userId', 'name image')  // Directly populate user
            .populate('docId', 'name image speciality')  // Directly populate doctor
            .sort({ date: -1 });

        console.log("Raw prescriptions:", prescriptions); // Debug log

        const formattedPrescriptions = prescriptions.map(prescription => {
            // Get user data either from appointmentId or direct population
            const userData = prescription.appointmentId?.userData || prescription.userId || {};
            // Get doctor data either from appointmentId or direct population
            const docData = prescription.appointmentId?.docData || prescription.docId || {};

            return {
                _id: prescription._id,
                userData: {
                    name: userData.name || 'N/A',
                    image: userData.image || '/default-profile.png'
                },
                docData: {
                    name: docData.name || 'N/A',
                    image: docData.image || '/default-doctor.png',
                    speciality: docData.speciality || 'Specialist'
                },
                medicines: prescription.medicines || [],
                dispensingStatus: prescription.dispensingStatus || 'pending',
                date: prescription.date,
                diagnosis: prescription.diagnosis,
                prescription: prescription.prescription
            };
        });

        console.log("Formatted prescriptions:", formattedPrescriptions); // Debug log

        res.json({
            success: true,
            prescriptions: formattedPrescriptions
        });
    } catch (error) {
        console.log("Error fetching prescriptions:", error);
        res.json({
            success: false,
            message: error.message
        });
    }
};


export const updateDispensing = async (req, res) => {
    try {
        const { prescriptionId, status } = req.body;
        
        // Update the diagnosis status
        const updatedDiagnosis = await diagnosisModel.findByIdAndUpdate(
            prescriptionId,
            { dispensingStatus: status },
            { new: true }
        ).populate('userId'); // Populate to get user details for notification

        if (!updatedDiagnosis) {
            return res.json({
                success: false,
                message: "Prescription not found"
            });
        }

        // Create a notification for the user
        if (updatedDiagnosis.userId) {
            const notification = new NotificationModel({
                userId: updatedDiagnosis.userId._id,
                message: `Your prescription has been ${status === 'completed' ? 'accepted' : 'rejected'} by the pharmacy`,
                type: "prescription_status",
                createdAt: new Date()
            });
            await notification.save();
        }

        res.json({
            success: true,
            message: `Prescription ${status === 'completed' ? 'accepted' : 'rejected'} successfully`
        });

    } catch (error) {
        console.log("Error updating prescription status:", error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Patient Medicine History
export const getPatientMedicineHistory = async (req, res) => {
    try {
        // Get all diagnoses with populated data
        const medicineHistory = await diagnosisModel.find()
            .populate({
                path: 'appointmentId',
                populate: [
                    { path: 'userData', select: 'name' },
                    { path: 'docData', select: 'name speciality' }
                ]
            })
            .sort({ date: -1 });

        const formattedHistory = medicineHistory.map(record => ({
            _id: record._id,
            patientName: record.appointmentId?.userData?.name || 'Unknown Patient',
            doctorName: record.appointmentId?.docData?.name || 'Unknown Doctor',
            doctorSpeciality: record.appointmentId?.docData?.speciality || 'Specialist',
            date: record.date,
            diagnosis: record.diagnosis,
            medicines: record.medicines || [],
            dispensingStatus: record.dispensingStatus || 'pending',
            dispensedDate: record.medicineHistory?.dispensedDate,
            refillsRemaining: record.medicineHistory?.refillsRemaining || 0
        }));

        res.json({
            success: true,
            history: formattedHistory
        });
    } catch (error) {
        console.log("Error fetching medicine history:", error);
        res.json({
            success: false,
            message: error.message
        });
    }
};