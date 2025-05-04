import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import appointmentModel from "../models/appointmentModel.js";
import diagnosisModel from "../models/diagnosisModel.js";
import NotificationModel from "../models/notificationModel.js";

import moment from 'moment-timezone';

// API to change doctor's availability
const changeAvailablity = async (req, res) => {
    try {
        const { docId } = req.body;

        const docData = await doctorModel.findById(docId);
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available });
        res.json({ success: true, message: 'Availability Changed' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get list of all doctors
const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email']);
        res.json({ success: true, doctors });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API for doctor login
const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;

        const doctor = await doctorModel.findOne({ email });

        if (!doctor) {
            return res.json({ success: false, message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, doctor.password);

        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
            res.json({ success: true, token, doctor });
        } else {
            res.json({ success: false, message: 'Invalid Credentials' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get doctor's appointments
const appointmentsDoctor = async (req, res) => {
    try {
        const { docId } = req.body;

        const appointments = await appointmentModel.find({ docId });

        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to mark appointment as completed
const appointmentComplete = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
            return res.json({ success: true, message: 'Appointment Completed' });
        } else {
            return res.json({ success: false, message: 'Mark Failed' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to cancel appointment
const appointmentCancel = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
            return res.json({ success: true, message: 'Appointment Cancelled' });
        } else {
            return res.json({ success: false, message: 'Cancellation Failed' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get doctor dashboard data
const doctorDashboard = async (req, res) => {
    try {
        const { docId } = req.body;

        const appointments = await appointmentModel.find({ docId });

        let earnings = 0;

        appointments.forEach((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount;
            }
        });

        let patients = [];

        appointments.forEach((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId);
            }
        });

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 5),
        };

        res.json({ success: true, dashData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get doctor's profile
const doctorProfile = async (req, res) => {
    try {
        const { docId } = req.body;
        const profileData = await doctorModel.findById(docId).select('-password');
        res.json({ success: true, profileData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to update doctor's profile
const updateDoctorProfile = async (req, res) => {
    try {
        const { docId, fees, address, available } = req.body;

        await doctorModel.findByIdAndUpdate(docId, { fees, address, available });

        res.json({ success: true, message: 'Profile Updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to create diagnosis with notification
const createDiagnosis = async (req, res) => {
    try {
        const {
            appointmentId,
            diagnosis,
            prescription,
            medicines,
            tests,
            followUpDate,
        } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData) {
            return res.json({ success: false, message: 'Appointment not found' });
        }

        const newDiagnosis = new diagnosisModel({
            appointmentId,
            docId: appointmentData.docId,
            userId: appointmentData.userId,
            diagnosis,
            prescription,
            medicines,
            tests,
            followUpDate: followUpDate ? new Date(followUpDate) : null,
        });

        const savedDiagnosis = await newDiagnosis.save();

        // Update appointment with diagnosis reference
        await appointmentModel.findByIdAndUpdate(appointmentId, {
            isCompleted: true,
            diagnosisCreated: true,
            diagnosisId: savedDiagnosis._id
        });

        // Create notification
        const notification = new NotificationModel({
            userId: appointmentData.userId,
            message: `Diagnosis for your appointment on ${appointmentData.slotDate} is ready.`,
            type: "diagnosis",
        });
        await notification.save();

        res.json({ success: true, message: "Diagnosis saved successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// API to get diagnosis details
const getDiagnosis = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const diagnosis = await diagnosisModel.findOne({ appointmentId });

        if (!diagnosis) {
            return res.json({ success: false, message: 'Diagnosis not found' });
        }

        res.json({ success: true, diagnosis });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get diagnosis history
const getDiagnosisHistory = async (req, res) => {
    try {
        const { userId } = req.body;
        const diagnoses = await diagnosisModel.find({ userId })
            .sort({ date: -1 })
            .populate('appointmentId')
            .populate('docId');
        res.json({ success: true, diagnoses });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get calendar events for a doctor
const getCalendarEvents = async (req, res) => {
    let calendarEvents = []; // Declare calendarEvents outside the try block
    try {
        const { docId } = req.body;
        const doctor = await doctorModel.findById(docId);
        const timezone = doctor.timezone || 'UTC';  // Or fetch from database

        const appointments = await appointmentModel.find({ docId: docId });

        calendarEvents = appointments.map(appointment => { // Assign to the declared variable
            const [day, month, year] = appointment.slotDate.split('_');
            const time = appointment.slotTime;

            let [hours, minutes] = time.slice(0, 5).split(':');
            const period = time.slice(5).trim().toUpperCase();

            if (period === 'PM' && hours !== '12') {
                hours = parseInt(hours) + 12;
            } else if (period === 'AM' && hours === '12') {
                hours = '00';
            }

            const dateTimeString = `${year}-${month}-${day} ${hours}:${minutes}`;

            const startDate = moment.tz(dateTimeString, 'YYYY-M-D HH:mm', timezone).toDate();

            return {
                title: `Appointment with ${appointment.userData.name}`,
                start: startDate,
                end: moment.tz(startDate, timezone).add(30, 'minutes').toDate(),
                allDay: false,
                extendedProps: {
                    appointmentId: appointment._id,
                    patientName: appointment.userData.name,
                    slotTime: appointment.slotTime
                }
            };
        });

        res.json({ success: true, calendarEvents });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


export {
    changeAvailablity,
    doctorList,
    loginDoctor,
    appointmentsDoctor,
    appointmentComplete,
    appointmentCancel,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
    createDiagnosis,
    getDiagnosis,
    getDiagnosisHistory,
    getCalendarEvents
};
