import Stripe from 'stripe';
import appointmentModel from "../models/appointmentModel.js";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16'
});

export const createPaymentIntent = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        console.log("Creating payment for appointment:", appointmentId);

        // Get appointment details
        const appointment = await appointmentModel.findById(appointmentId);
        
        if (!appointment) {
            console.log("Appointment not found:", appointmentId);
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Medical Appointment',
                            description: `Appointment with Dr. ${appointment.docData.name}`,
                        },
                        unit_amount: Math.round(appointment.amount * 100),
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                appointmentId: appointmentId
            },
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/my-appointments`,
        });

        console.log("Stripe session created:", session.id);

        res.json({
            success: true,
            sessionId: session.id
        });

    } catch (error) {
        console.error('Stripe Error Details:', {
            message: error.message,
            type: error.type,
            code: error.code,
            param: error.param,
            detail: error.detail
        });

        res.status(500).json({
            success: false,
            message: "Payment initiation failed",
            error: error.message
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { session_id } = req.query;
        console.log("Verifying payment for session:", session_id);

        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === 'paid') {
            const appointmentId = session.metadata.appointmentId;
            await appointmentModel.findByIdAndUpdate(appointmentId, {
                paymentStatus: 'Completed',
                paymentMethod: 'ONLINE',
                paymentId: session.payment_intent
            });

            return res.json({
                success: true,
                message: "Payment verified successfully"
            });
        }

        return res.status(400).json({
            success: false,
            message: "Payment not completed"
        });

    } catch (error) {
        console.error('Payment Verification Error:', error);
        res.status(500).json({
            success: false,
            message: "Payment verification failed",
            error: error.message
        });
    }
};
