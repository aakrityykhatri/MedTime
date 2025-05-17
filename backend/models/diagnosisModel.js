import mongoose from "mongoose";

const diagnosisSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'appointment',
        required: true
    },
    docId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctor',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    diagnosis: {
        type: String,
        required: true
    },
    prescription: {
        type: String,
        required: true
    },
    medicines: [{
        name: String,
        dosage: String,
        duration: String,
        timing: String
    }],
    tests: [{
        name: String,
        description: String
    }],
    dispensingStatus: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    followUpDate: Date,
    date: {
        type: Date,
        default: Date.now
    },
    date: {
        type: Date,
        default: Date.now
    },
    medicineHistory: {
        dispensedDate: {
            type: Date,
            default: Date.now
        },
        lastRefillDate: Date,
        refillsRemaining: {
            type: Number,
            default: 0
        },
        notes: String
    }
});

const diagnosisModel = mongoose.models.diagnosis || mongoose.model('diagnosis', diagnosisSchema);
export default diagnosisModel;
