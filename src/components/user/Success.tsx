import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const SuccessPage = () => {
    const [params] = useSearchParams();
    const eventId = params.get("event");

    useEffect(() => {
    }, [eventId]);

    return (
        <div className="text-center mt-10">
            <h1 className="text-3xl font-bold text-green-600">🎉 Payment Successful!</h1>
            <p className="mt-4 text-lg">Your ticket has been booked successfully.</p>
            <a
                href="/user/tickets"
                className="mt-6 inline-block px-6 py-2 bg-black text-white rounded-lg"
            >
                Go to My Tickets
            </a>
        </div>
    );
};

export default SuccessPage;

