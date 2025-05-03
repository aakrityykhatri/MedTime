import validator from "validator"
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from "../models/doctorModel.js"
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"
import userModel from "../models/userModel.js"
import pharmacyModel from "../models/pharmacyModel.js"
import nurseModel from "../models/nurseModel.js"

// API for adding doctor
const addDoctor = async (req,res) => {

    try {

        const {name, email, password, speciality, degree, experience, about, fees, address } = req.body
        const imageFile = req.file

        // checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({success:false,message:"Missing Details"})
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({success:false,message:"Please enter a valid email"})
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({success:false,message:"Please enter a strong password"})
        }

        // hashing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"})
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({success:true,message:"Doctor Added"})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
        
    }

}

//API for admin Login
const loginAdmin = async (req,res) => {
    try {

        const {email,password} = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            
            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})

        } else {
            res.json({success:false,message:"Invalid Credential"})
        }
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// API to get all doctors list for admin panel
const allDoctors = async (req,res) => {
    try {
        
        const doctors = await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
    try {
        const appointments = await appointmentModel.find()
            .populate('userData')
            .populate('docData')
            .populate({
                path: 'diagnosisId',
                select: 'dispensingStatus medicines'
            })
            .sort({ date: -1 });

        const formattedAppointments = appointments.map(appointment => ({
            ...appointment.toObject(),
            diagnosisStatus: appointment.diagnosisId?.dispensingStatus || 'pending',
            medicines: appointment.diagnosisId?.medicines || []
        }));

        res.json({
            success: true,
            appointments: formattedAppointments
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};


// API for appointment cancellation
const appointmentCancel = async (req,res) => {
    try {

        const { appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled:true})

        // releasing doctor slot

        const{ docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({success:true,message:"Appointment Cancelled"})
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// API to get dashboard data for admin panel
const adminDashboard = async (req,res) => {
    try {
        
        const doctors = await doctorModel.find({})
        const appointments = await appointmentModel.find({})
        const users = await userModel.find({})

        const dashData = {
            doctors:doctors.length,
            appointments:appointments.length,
            patients:users.length,
            latestAppointments:appointments.reverse().slice(0,5)
        }

        res.json({success:true,dashData})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// API for adding pharmacy
const addPharmacy = async (req, res) => {
    try {
        const { name, email, password, license, phone, about, address } = req.body;
        const imageFile = req.file;

        if (!name || !email || !password || !license || !phone || !address) {
            return res.json({
                success: false,
                message: "Missing Details"
            });
        }

        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Invalid Email Format"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: "image"
        });
        const imageUrl = imageUpload.secure_url;

        const pharmacyData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            license,
            phone,
            about,
            address: JSON.parse(address),
            date: Date.now()
        };

        const newPharmacy = new pharmacyModel(pharmacyData);
        await newPharmacy.save();

        res.json({
            success: true,
            message: "Pharmacy Added Successfully"
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// API to get all pharmacies
const getAllPharmacies = async (req, res) => {
    try {
        const pharmacies = await pharmacyModel.find().select('-password');
        res.json({
            success: true,
            pharmacies
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// API to change pharmacy availability
const changePharmacyAvailability = async (req, res) => {
    try {
        const { pharmacyId } = req.body;
        const pharmacy = await pharmacyModel.findById(pharmacyId);
        await pharmacyModel.findByIdAndUpdate(pharmacyId, {
            available: !pharmacy.available
        });
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

// API for adding nurse
const addNurse = async (req, res) => {
    try {
        const { 
            name, 
            email, 
            password, 
            department,
            shift,
            licenseNumber,
            specialization,
            experience,
            phone,
            address 
        } = req.body;
        const imageFile = req.file;

        // Validation checks
        if (!name || !email || !password || !department || !licenseNumber || !phone || !address) {
            return res.json({
                success: false,
                message: "Missing Details"
            });
        }

        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Invalid Email Format"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: "image"
        });
        const imageUrl = imageUpload.secure_url;

        const nurseData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            department,
            shift,
            licenseNumber,
            specialization,
            experience,
            phone,
            address: JSON.parse(address),
            date: Date.now()
        };

        const newNurse = new nurseModel(nurseData);
        await newNurse.save();

        res.json({
            success: true,
            message: "Nurse Added Successfully"
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// API to get all nurses
const getAllNurses = async (req, res) => {
    try {
        const nurses = await nurseModel.find().select('-password');
        res.json({
            success: true,
            nurses
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// API to change nurse availability
const changeNurseAvailability = async (req, res) => {
    try {
        const { nurseId } = req.body;
        const nurse = await nurseModel.findById(nurseId);
        await nurseModel.findByIdAndUpdate(nurseId, {
            available: !nurse.available
        });
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


export {addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard, addPharmacy, getAllPharmacies, changePharmacyAvailability, addNurse, getAllNurses, changeNurseAvailability}