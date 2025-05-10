import mongoose from "mongoose";

const pharmacySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "default_pharmacy_image_url"
    },
    license: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        line1: String,
        line2: String
    },
    about: {
        type: String,
        default: ""
    },
    available: {
        type: Boolean,
        default: true
    },
    dispensingHistory: [{
        prescriptionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'diagnosis'
        },
        dispensedAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'cancelled'],
            default: 'pending'
        }
    }],
    date: {
        type: Number,
        default: Date.now
    }
});

const pharmacyModel = mongoose.models.pharmacy || mongoose.model('pharmacy', pharmacySchema);
export default pharmacyModel;
