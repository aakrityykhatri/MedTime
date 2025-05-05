import mongoose from "mongoose";

const nurseSchema = new mongoose.Schema({
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
        default: "default_nurse_image_url"
    },
    licenseNumber: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String,
        required: true
    },
    shift: {
        type: String,
        enum: ['morning', 'evening', 'night'],
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        line1: String,
        line2: String
    },
    available: {
        type: Boolean,
        default: true
    },
    assignedDoctors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctor'
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

const nurseModel = mongoose.models.nurse || mongoose.model('nurse', nurseSchema);
export default nurseModel;
