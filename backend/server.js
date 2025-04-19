import express from 'express';
import cors from "cors";
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';
import paymentRoutes from './routes/paymentRoutes.js';
import notificationRouter from './routes/notificationRoute.js';
import pharmacyRouter from './routes/pharmacyRoute.js';
import nurseRouter from './routes/nurseRoute.js';

const app = express();
const port = process.env.PORT || 4000;

// Connect to databases
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);
app.use("/api/payment", paymentRoutes);
app.use('/api/notifications', notificationRouter);
app.use('/api/pharmacy', pharmacyRouter);
app.use('/api/nurse', nurseRouter);

// Test routes
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working' });
});

app.get('/', (req, res) => {
    res.send('API WORKING');
});

// Start server
app.listen(port, () => {
    console.log(`Server Started on port ${port}`);
    });

