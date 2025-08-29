import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userService } from "../../services/user/userService";
import HomeNavbar from '../layout/user/HomeNavbar';
import Footer from "../layout/user/Footer";



interface EventData {
    eventName: string;
    date: string;
    time: string;
    eventType: string;
    category: "Public" | "Private";
    subCategory?: "Reserved" | "General";
    totalTicketsSold?: number;
    totalRevenue?: number;
    mainImage: string;
    additionalImages: string[];
}

const PostDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [event, setEvent] = useState<EventData | null>(null);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchEvent = async () => {
    const response = await userService.getEventDetailsById(id as any);

    if (response.success) {
      setEvent(response.data);
    } else {
      console.error("Error fetching event:", response.error);
    }

    setLoading(false);
  };

  if (id) {
    fetchEvent();
  }
}, [id]);


    if (loading) return <div className="text-center mt-10 text-gray-600">Loading...</div>;

    if (!event) return <div className="text-center mt-10 text-red-500">Event not found</div>;

    return (
        <div className="bg-gradient-to-br from-green-50 via-green-100 to-blue-50">

            <HomeNavbar />
            <div className="max-w-4xl mx-auto p-6 mt-20 mb-20">
                <div className="overflow-hidden rounded-2xl shadow-lg">
                    <img
                        src={event.mainImage}
                        alt={event.eventName}
                        className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
                    />
                </div>

                <div className="mt-6 bg-white p-6 rounded-2xl shadow-md">
                    {event.eventName && (
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">{event.eventName}</h2>
                    )}

                    <div className="flex flex-wrap gap-13 mb-6">
                        {event.category && (
                            <div className="flex flex-col items-start gap-2">
                                <p className="text-sm font-semibold mb-1">Category:</p>
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {event.category}
                                </span>
                            </div>
                        )}
                        {event.eventType && (
                            <div className="flex flex-col items-start gap-2">
                                <p className="text-sm font-semibold mb-1">Event Type:</p>
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {event.eventType}
                                </span>
                            </div>
                        )}
                        {event.subCategory && (
                            <div className="flex flex-col items-start gap-2">
                                <p className="text-sm font-semibold mb-1">Sub Category:</p>
                                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {event.subCategory}
                                </span>
                            </div>
                        )}
                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
                        {event.date && (
                            <div>
                                <p className="text-sm font-semibold mb-1">Date</p>
                                <p className="text-md">{new Date(event.date).toLocaleDateString()}</p>
                            </div>
                        )}

                        {event.time && (
                            <div>
                                <p className="text-sm font-semibold mb-1">Time</p>
                                <p className="text-md">{event.time}</p>
                            </div>
                        )}

                        {typeof event.totalTicketsSold === "number" && event.totalTicketsSold > 0 && (
                            <div>
                                <p className="text-sm font-semibold mb-1">Total Tickets Sold</p>
                                <p className="text-md">{event.totalTicketsSold}</p>
                            </div>
                        )}

                        {typeof event.totalRevenue === "number" && event.totalRevenue > 0 && (
                            <div>
                                <p className="text-sm font-semibold mb-1">Total Revenue</p>
                                <p className="text-md">₹{event.totalRevenue.toFixed(2)}</p>
                            </div>
                        )}

                    </div>




                </div>




                <h3 className="text-2xl font-semibold text-gray-800 mt-10">Gallery</h3>
                {event.additionalImages.length > 0 && (
                    <div className="mt-8 flex items-center justify-center ">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 ">
                            {event.additionalImages.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`Additional ${idx + 1}`}
                                    className="w-full h-42 object-cover rounded-lg shadow-sm hover:shadow-md transition"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Footer />

        </div>
    );
};

export default PostDetailPage;
