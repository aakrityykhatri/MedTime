import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const session_id = searchParams.get('session_id');

                if (!session_id) {
                    toast.error('Invalid payment response');
                    navigate('/my-appointments');
                    return;
                }

                const { data } = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/payment/verify-payment`,
                    { 
                        params: { session_id },
                        headers: { 
                            token: localStorage.getItem('token')
                        } 
                    }
                );

                if (data.success) {
                    toast.success('Payment successful!');
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error('Verification error:', error);
                toast.error('Payment verification failed');
            } finally {
                navigate('/my-appointments');
            }
        };

        verifyPayment();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Processing Payment</h2>
                <p>Please wait while we verify your payment...</p>
            </div>
        </div>
    );
};

export default PaymentSuccess;
