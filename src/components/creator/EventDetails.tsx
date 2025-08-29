import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { creatorService } from "../../services/creator/creatorService";
import SideBar from "../layout/creator/SideBar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

interface SeatLayout {
  _id: string
  layoutType: 'normal' | 'withbalcony' | 'reclanar' | 'centeredscreen';
  totalSeats: number;
  normalPrice?: number;
  balconyPrices?: {
    normal: number;
    premium: number;
  };
  reclanarPrices?: {
    reclanar: number;
    reclanarPlus: number;
  };
}

interface Event {
  eventName: string;
  eventType: string;
  description: string;
  daySelectionMode: 'single' | 'range';
  date?: string;
  startDate?: string;
  endDate?: string;
  time: string;
  location: string;
  totalSeats: number;
  price: number;
  seatType: string;
  image?: string;
  isListed: boolean;
  layoutId: SeatLayout;

}

const EventDetails: React.FC = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        console.log('Fetching event with ID:', id);
        const data = await creatorService.getEventById(id!);
        setEvent(data);
        setEditedDescription(data.description);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching event:', error);
        setError("Failed to fetch event data");
        setLoading(false);
      }
    };
    if (id) fetchEvent();
  }, [id]);

  const saveDescription = async () => {
    try {
      await creatorService.updateEventDescription(id!, editedDescription);
      setEvent(prev => prev ? { ...prev, description: editedDescription } : null);
      setEditMode(false);
    } catch (err) {
      Toastify({
        text: "Failed to update description",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "#ff4d4d",
        stopOnFocus: true
      }).showToast();
    }

  };

  const toggleListing = async () => {
    if (!event) return;

    try {
      const updatedStatus = !event.isListed;
      await creatorService.toggleEventListing(id!, updatedStatus);
      setEvent(prev => prev ? { ...prev, isListed: updatedStatus } : null);
    } catch (err) {
      Toastify({
        text: "Failed to update listing status",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "#ff4d4d",
        stopOnFocus: true
      }).showToast();
    }

  };



  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!event) return <div>No Event Data Found</div>;


  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <SideBar />

        <div className="flex-1 min-h-screen bg-gray-200 p-10">
          {/* Breadcrumbs */}
          <nav className="text-gray-600 text-sm mb-6">
            <ul className="flex items-center font-bold text-lg space-x-2">
              <li>
                <Link to="/creator/events" className="text-gray-400 hover:text-black">
                  Event
                </Link>
              </li>
              <span className="text-gray-400">/</span>
              <li className="text-black">Event Details</li>
            </ul>
          </nav>

          {/* Main Content */}
          <div className="flex items-center justify-center">
            <div className="bg-gray-400 p-8 rounded-2xl shadow-lg max-w-4xl w-full">
              <div className="bg-gray-100 p-6 rounded-lg flex flex-col md:flex-row gap-6">
                {/* Event Image */}
                <div className="w-full md:w-1/3">
                  <img
                    src={event.image || "https://via.placeholder.com/300"}
                    alt="Event"
                    className="rounded-lg object-cover w-full h-full"
                  />
                </div>

                {/* Event Info */}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-center text-gray-800">
                    {event.eventName}
                  </h1>

                  <div className="mt-3 grid grid-cols-2 gap-3 text-gray-700">
                    <div className="bg-gray-300 p-3 rounded-lg text-center">
                      DATE: {
                        event.daySelectionMode === 'single' && event.date
                          ? new Date(event.date).toLocaleDateString()
                          : event.daySelectionMode === 'range' && event.startDate && event.endDate
                            ? `${new Date(event.startDate).toLocaleDateString()} - ${new Date(event.endDate).toLocaleDateString()}`
                            : 'Date not available'
                      }
                    </div>

                    <div className="bg-gray-300 p-2 rounded-lg text-center">
                      SEAT TYPE: {event.seatType}
                    </div>

                    <div className="bg-gray-300 p-2 rounded-lg text-center">
                      TIME: {event.time}
                    </div>

                    {event.seatType === 'RESERVED' && event.layoutId && (
                      <>
                        <div className="bg-gray-300 p-2 rounded-lg text-center">
                          LAYOUT TYPE: {event.layoutId.layoutType}
                        </div>
                        <div className="bg-gray-300 p-2 rounded-lg text-center">
                          TOTAL SEATS: {event.layoutId.totalSeats}
                        </div>

                        {event.layoutId.layoutType === 'normal' || event.layoutId.layoutType === 'centeredscreen' ? (
                          <div className="bg-gray-300 p-2 rounded-lg text-center">
                            TICKET PRICE: ₹{event.layoutId.normalPrice}
                          </div>
                        ) : null}

                        {event.layoutId.layoutType === 'withbalcony' && event.layoutId.balconyPrices && (
                          <>
                            <div className="bg-gray-300 p-2 rounded-lg text-center">
                              Balcony Normal: ₹{event.layoutId.balconyPrices.normal}
                            </div>
                            <div className="bg-gray-300 p-2 rounded-lg text-center">
                              Balcony Premium: ₹{event.layoutId.balconyPrices.premium}
                            </div>
                          </>
                        )}

                        {event.layoutId.layoutType === 'reclanar' && event.layoutId.reclanarPrices && (
                          <>
                            <div className="bg-gray-300 p-2 rounded-lg text-center">
                              Reclanar: ₹{event.layoutId.reclanarPrices.reclanar}
                            </div>
                            <div className="bg-gray-300 p-2 rounded-lg text-center">
                              Reclanar Plus: ₹{event.layoutId.reclanarPrices.reclanarPlus}
                            </div>
                          </>
                        )}
                      </>
                    )}<div className="bg-gray-300 p-2 rounded-lg text-center">

                      TICKET PRICE: ₹{event.price}
                    </div>


                    <div className="bg-gray-300 p-2 rounded-lg text-center col-span-2">
                      LOCATION: {event.location}
                    </div>
                  </div>


                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-100 p-4 rounded-lg mt-4 text-gray-700">
                {editMode ? (
                  <>
                    <textarea
                      className="w-full p-2 rounded border border-gray-300 mb-2"
                      rows={4}
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        className="bg-gray-400 text-white px-4 py-1 rounded"
                        onClick={() => setEditMode(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-blue-500 text-white px-4 py-1 rounded"
                        onClick={saveDescription}
                      >
                        Save
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-800 text-base leading-relaxed">
                      {event.description}
                    </p>
                    <button
                      onClick={() => setEditMode(true)}
                      className="mt-4 bg-black text-white hover:bg-white hover:text-black border border-black px-4 py-2 rounded-lg shadow-sm font-semibold transition duration-200"
                    >
                      Edit
                    </button>
                  </>


                )}
              </div>


              {/* Listing Status & Button */}
              <div className="flex flex-col items-center mt-6">
                <p className="text-white mb-2 font-semibold">
                  Status: {event.isListed ? "✅ Listed" : "🚫 Not Listed"}
                </p>
                <button
                  onClick={toggleListing}
                  className={`px-6 py-2 rounded-lg font-bold ${event.isListed
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                    } text-white transition`}
                >
                  {event.isListed ? "Unlist Event" : "List Event"}
                </button>
              </div>

              {/* Conditional Booking Button */}
              {event.seatType === "RESERVED" && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => {
                      navigate(`/creator/booking/${event.layoutId._id}`)
                    }}
                    className="bg-black text-white font-medium rounded px-4 py-2"
                  >
                    Booking
                  </button>
                </div>
              )}


            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default EventDetails;
