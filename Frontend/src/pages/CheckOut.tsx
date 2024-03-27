import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const stripePromise = loadStripe('pk_test_51OvyXFSDixfav162C6nvCMM31tNwE62Mr5KneBaRQgPNDm17MxGbx28TOrqplYVVSvQECc0TcZlCqMq3Ejft7U8u00cLtdmFzF');

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);

        const { paymentIntent, error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin,
            },
            redirect: "if_required",
        });

        if(error) {
            setIsProcessing(false);
            console.log(error.message || "Something went wrong")
            return toast.error(error.message || "Something went wrong");
        } 

        if(paymentIntent.status === "succeeded") {
            console.log("Placing order");
            navigate('/orders');
        }
        setIsProcessing(false);
    }

    return (
        <div className="checkout-container">
            <form onSubmit={submitHandler}>
                <PaymentElement />
                <button type='submit' disabled={isProcessing}>
                    {isProcessing ? "Processing..." : "Pay"}
                </button>
            </form>
        </div>
    );
};


const CheckOut = () => {
    const options = {
        // passing the client secret obtained from the server
        clientSecret: "pi_3OyD9tSDixfav1620mKZjgwT_secret_uwZD2PPODFbOVYIVXI5qYzhJD"
    };

    return (
        <Elements stripe={stripePromise} options={options} >
            <CheckoutForm />
        </Elements>
    )
}

export default CheckOut
