import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nurseModel from '../models/nurseModel.js';
import patientModel from '../models/patientModel.js';
import doctorModel from '../models/doctorModel.js';
import { v2 as cloudinary } from 'cloudinary';

// Nurse Login
export const loginNurse = async (req, res) => {
    try {
        const { email, password } = req.body;

        const nurse = await nurseModel.findOne({ email });
        if (!nurse) {
            return res.json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, nurse.password);
        if (isMatch) {
            const token = jwt.sign(
                { id: nurse._id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );
            
            res.json({
                success: true,
                token,
                nurse: {
                    _id: nurse._id,
                    name: nurse.name,
                    email: nurse.email,
                    image: nurse.image,
                    department: nurse.department,
                    shift: nurse.shift
                }
            });
        } else {
            res.json({
                success: false,
                message: "Invalid Credentials"
            });
        }
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Get Nurse Profile
export const getNurseProfile = async (req, res) => {
    try {
        const nurse = await nurseModel.findById(req.nurseId)
            .select('-password')
            .populate('assignedDoctors', 'name speciality image');

        res.json({
            success: true,
            nurse
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Update Nurse Profile
export const updateNurseProfile = async (req, res) => {
    try {
        const { name, phone, department, shift, address } = req.body;
        const imageFile = req.file;

        const updateData = {
            name,
            phone,
            department,
            shift,
            address: JSON.parse(address)
        };

        if (imageFile) {
            const result = await cloudinary.uploader.upload(imageFile.path);
            updateData.image = result.secure_url;
        }

        const nurse = await nurseModel.findByIdAndUpdate(
            req.nurseId,
            updateData,
            { new: true }
        ).select('-password');

        res.json({
            success: true,
            message: "Profile Updated Successfully",
            nurse
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Change Availability Status
export const changeAvailability = async (req, res) => {
    try {
        const nurse = await nurseModel.findById(req.nurseId);
        nurse.available = !nurse.available;
        await nurse.save();

        res.json({
            success: true,
            message: "Availability Updated Successfully"
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Get nurse dashboard data
export const getNurseDashboard = async (req, res) => {
    try {
        const nurseId = req.nurseId;
        
        // Get counts for dashboard stats
        const admittedPatientsCount = await patientModel.countDocuments({ 
            assignedNurse: nurseId,
            status: 'Admitted'
        });
        
        const toBeDischarged = await patientModel.countDocuments({
            assignedNurse: nurseId,
            status: 'To Be Discharged'
        });
        
        const pendingFollowUps = await patientModel.countDocuments({
            assignedNurse: nurseId,
            'followUpTasks.completed': false
        });
        
        const pendingReports = await patientModel.countDocuments({
            assignedNurse: nurseId,
            'labReports.verified': false
        });

        const followUpCount = await patientModel.countDocuments({
            assignedNurse: nurseId,
            status: 'Follow Up'
        });

        const checkupCount = await patientModel.countDocuments({
            assignedNurse: nurseId,
            status: 'Checkup'
        });
        
        // Get recent patients
        const recentPatients = await patientModel
            .find({ assignedNurse: nurseId })
            .sort({ updatedAt: -1 })
            .limit(5)
            .select('name status bedNumber wardNumber admissionDate');
        
        // Get pending tasks
        const pendingTasks = await patientModel.aggregate([
            { $match: { assignedNurse: nurseId } },
            { $unwind: '$followUpTasks' },
            { $match: { 'followUpTasks.completed': false } },
            { $sort: { 'followUpTasks.dueDate': 1 } },
            { $limit: 5 },
            {
                $project: {
                    patientName: '$name',
                    patientId: '$_id',
                    taskDescription: '$followUpTasks.description',
                    dueDate: '$followUpTasks.dueDate',
                    taskId: '$followUpTasks._id'
                }
            }
        ]);

        res.json({
            success: true,
            dashboardData: {
                admittedPatientsCount,
                toBeDischarged,
                pendingFollowUps,
                pendingReports,
                followUpCount,
                checkupCount,
                recentPatients,
                pendingTasks
            }
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Get all patients assigned to nurse
export const getNursePatients = async (req, res) => {
    try {
        const nurseId = req.nurseId;
        const { status } = req.query;
        
        let query = { assignedNurse: nurseId };
        
        if (status && ['Admitted', 'Discharged', 'To Be Discharged'].includes(status)) {
            query.status = status;
        }
        
        const patients = await patientModel
            .find(query)
            .populate('assignedDoctor', 'name speciality')
            .sort({ updatedAt: -1 });
        
        res.json({
            success: true,
            patients
        });
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Add new patient
export const addPatient = async (req, res) => {
    try {
        const nurseId = req.nurseId;
        const {
            name,
            age,
            gender,
            contactNumber,
            emergencyContact,
            address,
            medicalHistory,
            allergies,
            bloodType,
            bedNumber,
            wardNumber,
            assignedDoctor
        } = req.body;
        
        const newPatient = new patientModel({
            name,
            age,
            gender,
            contactNumber,
            emergencyContact: JSON.parse(emergencyContact),
            address: JSON.parse(address),
            medicalHistory,
            allergies: allergies ? JSON.parse(allergies) : [],
            bloodType,
            bedNumber,
            wardNumber,
            assignedDoctor,
            assignedNurse: nurseId,
            status: 'Admitted',
            admissionDate: new Date()
        });
        
        await newPatient.save();
        
        res.json({
            success: true,
            message: 'Patient added successfully',
            patient: newPatient
        });
    } catch (error) {
        console.error('Error adding patient:', error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Update patient details
export const updatePatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        const updateData = req.body;
        
        // Handle nested objects
        if (updateData.emergencyContact) {
            updateData.emergencyContact = JSON.parse(updateData.emergencyContact);
        }
        
        if (updateData.address) {
            updateData.address = JSON.parse(updateData.address);
        }
        
        if (updateData.allergies) {
            updateData.allergies = JSON.parse(updateData.allergies);
        }
        
        // If status is changed to Discharged, add discharge date
        if (updateData.status === 'Discharged' && !updateData.dischargeDate) {
            updateData.dischargeDate = new Date();
        }
        
        const updatedPatient = await patientModel.findByIdAndUpdate(
            patientId,
            updateData,
            { new: true }
        );
        
        if (!updatedPatient) {
            return res.json({
                success: false,
                message: 'Patient not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Patient updated successfully',
            patient: updatedPatient
        });
    } catch (error) {
        console.error('Error updating patient:', error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Get patient details
export const getPatientDetails = async (req, res) => {
    try {
        const { patientId } = req.params;
        
        const patient = await patientModel
            .findById(patientId)
            .populate('assignedDoctor', 'name speciality image')
            .populate('assignedNurse', 'name department');
        
        if (!patient) {
            return res.json({
                success: false,
                message: 'Patient not found'
            });
        }
        
        res.json({
            success: true,
            patient
        });
    } catch (error) {
        console.error('Error fetching patient details:', error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Add vital signs
export const addVitalSigns = async (req, res) => {
    try {
        const { patientId } = req.params;
        const vitalData = req.body;
        
        const patient = await patientModel.findById(patientId);
        
        if (!patient) {
            return res.json({
                success: false,
                message: 'Patient not found'
            });
        }
        
        patient.vitalSigns.push(vitalData);
        await patient.save();
        
        res.json({
            success: true,
            message: 'Vital signs added successfully',
            vitalSigns: patient.vitalSigns
        });
    } catch (error) {
        console.error('Error adding vital signs:', error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Add medication
export const addMedication = async (req, res) => {
    try {
        const { patientId } = req.params;
        const medicationData = req.body;
        
        const patient = await patientModel.findById(patientId);
        
        if (!patient) {
            return res.json({
                success: false,
                message: 'Patient not found'
            });
        }
        
        patient.medications.push(medicationData);
        await patient.save();
        
        res.json({
            success: true,
            message: 'Medication added successfully',
            medications: patient.medications
        });
    } catch (error) {
        console.error('Error adding medication:', error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Add lab report
export const addLabReport = async (req, res) => {
    try {
        const { patientId } = req.params;
        const reportData = req.body;
        
        const patient = await patientModel.findById(patientId);
        
        if (!patient) {
            return res.json({
                success: false,
                message: 'Patient not found'
            });
        }
        
        patient.labReports.push(reportData);
        await patient.save();
        
        res.json({
            success: true,
            message: 'Lab report added successfully',
            labReports: patient.labReports
        });
    } catch (error) {
        console.error('Error adding lab report:', error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Verify lab report
export const verifyLabReport = async (req, res) => {
    try {
        const { patientId, reportId } = req.params;
        const nurseId = req.nurseId;
        
        const patient = await patientModel.findById(patientId);
        
        if (!patient) {
            return res.json({
                success: false,
                message: 'Patient not found'
            });
        }
        
        const reportIndex = patient.labReports.findIndex(
            report => report._id.toString() === reportId
        );
        
        if (reportIndex === -1) {
            return res.json({
                success: false,
                message: 'Report not found'
            });
        }
        
        patient.labReports[reportIndex].verified = true;
        patient.labReports[reportIndex].verifiedBy = nurseId;
        patient.labReports[reportIndex].verificationDate = new Date();
        
        await patient.save();
        
        res.json({
            success: true,
            message: 'Report verified successfully',
            labReports: patient.labReports
        });
    } catch (error) {
        console.error('Error verifying report:', error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Add nurse note
export const addNurseNote = async (req, res) => {
    try {
        const { patientId } = req.params;
        const { note } = req.body;
        const nurseId = req.nurseId;
        
        const patient = await patientModel.findById(patientId);
        
        if (!patient) {
            return res.json({
                success: false,
                message: 'Patient not found'
            });
        }
        
        patient.nurseNotes.push({
            note,
            nurseId,
            date: new Date()
        });
        
        await patient.save();
        
        res.json({
            success: true,
            message: 'Note added successfully',
            nurseNotes: patient.nurseNotes
        });
    } catch (error) {
        console.error('Error adding note:', error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Record hospital round visit
export const recordRoundVisit = async (req, res) => {
    try {
        const { patientId } = req.params;
        const { notes } = req.body;
        const nurseId = req.nurseId;
        
        const patient = await patientModel.findById(patientId);
        
        if (!patient) {
            return res.json({
                success: false,
                message: 'Patient not found'
            });
        }
        
        patient.roundVisits.push({
            notes,
            performedBy: nurseId,
            date: new Date()
        });
        
        await patient.save();
        
        res.json({
            success: true,
            message: 'Round visit recorded successfully',
            roundVisits: patient.roundVisits
        });
    } catch (error) {
        console.error('Error recording round visit:', error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Add follow-up task
export const addFollowUpTask = async (req, res) => {
    try {
        const { patientId } = req.params;
        const { description, dueDate } = req.body;
        const nurseId = req.nurseId;
        
        const patient = await patientModel.findById(patientId);
        
        if (!patient) {
            return res.json({
                success: false,
                message: 'Patient not found'
            });
        }
        
        patient.followUpTasks.push({
            description,
            dueDate: new Date(dueDate),
            assignedTo: nurseId
        });
        
        await patient.save();
        
        res.json({
            success: true,
            message: 'Follow-up task added successfully',
            followUpTasks: patient.followUpTasks
        });
    } catch (error) {
        console.error('Error adding follow-up task:', error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Complete follow-up task
export const completeFollowUpTask = async (req, res) => {
    try {
        const { patientId, taskId } = req.params;
        
        const patient = await patientModel.findById(patientId);
        
        if (!patient) {
            return res.json({
                success: false,
                message: 'Patient not found'
            });
        }
        
        const taskIndex = patient.followUpTasks.findIndex(
            task => task._id.toString() === taskId
        );
        
        if (taskIndex === -1) {
            return res.json({
                success: false,
                message: 'Task not found'
            });
        }
        
        patient.followUpTasks[taskIndex].completed = true;
        patient.followUpTasks[taskIndex].completedDate = new Date();
        
        await patient.save();
        
        res.json({
            success: true,
            message: 'Task marked as completed',
            followUpTasks: patient.followUpTasks
        });
    } catch (error) {
        console.error('Error completing task:', error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Get all doctors for assignment
export const getAllDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel
            .find({ available: true })
            .select('name speciality image');
        
        res.json({
            success: true,
            doctors
        });
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Assign doctor to patient
export const assignDoctor = async (req, res) => {
    try {
        const { patientId } = req.params;
        const { doctorId } = req.body;
        
        const updatedPatient = await patientModel.findByIdAndUpdate(
            patientId,
            { assignedDoctor: doctorId },
            { new: true }
        ).populate('assignedDoctor', 'name speciality image');
        
        if (!updatedPatient) {
            return res.json({
                success: false,
                message: 'Patient not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Doctor assigned successfully',
            patient: updatedPatient
        });
    } catch (error) {
        console.error('Error assigning doctor:', error);
        res.json({
            success: false,
            message: error.message
        });
    }
};