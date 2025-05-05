import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String
    },
    address: {
        line1: String,
        line2: String,
        city: String,
        state: String,
        zipCode: String
    },
    medicalHistory: {
        type: String,
        default: ''
    },
    allergies: [String],
    bloodType: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
        default: 'Unknown'
    },
    status: {
        type: String,
        enum: ['Admitted', 'Discharged', 'To Be Discharged', 'Follow Up', 'Checkup'],
        default: 'Admitted'
    },
    admissionDate: {
        type: Date,
        default: Date.now
    },
    dischargeDate: {
        type: Date
    },
    bedNumber: {
        type: String
    },
    wardNumber: {
        type: String
    },
    assignedDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctor'
    },
    assignedNurse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'nurse'
    },
    vitalSigns: [{
        date: {
            type: Date,
            default: Date.now
        },
        temperature: Number,
        bloodPressure: String,
        heartRate: Number,
        respiratoryRate: Number,
        oxygenSaturation: Number,
        notes: String
    }],
    medications: [{
        name: String,
        dosage: String,
        frequency: String,
        startDate: Date,
        endDate: Date,
        notes: String
    }],
    labReports: [{
        testName: String,
        date: Date,
        results: String,
        verified: {
            type: Boolean,
            default: false
        },
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'nurse'
        },
        verificationDate: Date
    }],
    nurseNotes: [{
        date: {
            type: Date,
            default: Date.now
        },
        note: String,
        nurseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'nurse'
        }
    }],
    roundVisits: [{
        date: {
            type: Date,
            default: Date.now
        },
        notes: String,
        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'nurse'
        }
    }],
    followUpTasks: [{
        description: String,
        dueDate: Date,
        completed: {
            type: Boolean,
            default: false
        },
        completedDate: Date,
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'nurse'
        }
    }]
}, { timestamps: true });

const patientModel = mongoose.models.patient || mongoose.model('patient', patientSchema);
export default patientModel;
