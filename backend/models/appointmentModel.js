import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    docId: {type: String, required: true},
    slotDate: {type: String, required: true},
    slotTime: {type: String, required: true},
    userData: {type: Object, required: true},
    docData: {type: Object, required: true},
    amount: {type: Number, required: true},
    date: {type: Number, required: true},
    cancelled: {type: Boolean, default: false},
    isCompleted: {type: Boolean, default: false},
    // Add these new fields
    diagnosisId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'diagnosis'
    },
    diagnosisCreated: {
        type: Boolean,
        default: false
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        enum: ['CASH', 'ONLINE'],
        default: 'CASH'
    },
    stripeSessionId: String,
    paymentId: String
})

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment', appointmentSchema)
export default appointmentModel
