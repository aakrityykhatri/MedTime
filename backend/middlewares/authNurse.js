import jwt from 'jsonwebtoken';
import nurseModel from '../models/nurseModel.js';

const authNurse = async (req, res, next) => {
    try {
        const { ntoken } = req.headers;

        if (!ntoken) {
            return res.json({
                success: false,
                message: 'Not Authorized, Please Login Again'
            });
        }

        const decoded = jwt.verify(ntoken, process.env.JWT_SECRET);
        const nurse = await nurseModel.findById(decoded.id).select('-password');

        if (!nurse) {
            return res.json({
                success: false,
                message: 'Nurse not found'
            });
        }

        req.nurse = nurse;
        req.nurseId = nurse._id;
        next();

    } catch (error) {
        console.log("Nurse auth error:", error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

export default authNurse;
