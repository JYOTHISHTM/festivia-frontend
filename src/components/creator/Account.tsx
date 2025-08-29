import { useEffect, useState } from 'react';
import Sidebar from "../layout/creator/SideBar";
import { creatorService } from "../../services/creator/creatorService";

interface Buyer {
  name: string;
  email: string;
  price: number;
  createdAt: string;
}

interface EventGroup {
  _id: string;
  eventName: string;
  eventImage: string;
  ticketsSold: number;
  totalRevenue: number;
  totalBuyers: number;
  buyers: Buyer[];
  totalPages: number;
  currentPage: number;
  isSelected: boolean;
}

function Account() {
  const [eventData, setEventData] = useState<EventGroup[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventGroup | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [buyersLoading, setBuyersLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const buyersPerPage = 2;

  useEffect(() => {
  const fetchInitialData = async () => {
    const creator = localStorage.getItem("creator");
    if (!creator) return;
    const creatorId = JSON.parse(creator).id;

    try {
      const res = await creatorService.getTicketSummary(creatorId, 1, buyersPerPage);
      const data = res.summary || [];
      setEventData(data);

      if (data.length > 0) {
        const firstEvent = data[0];
        setSelectedEvent(firstEvent);
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load event data");
      setLoading(false);
    }
  };

  fetchInitialData();
}, []);

useEffect(() => {
  const fetchEventBuyers = async () => {
    if (!selectedEvent) return;

    setBuyersLoading(true);
    const creator = localStorage.getItem("creator");
    if (!creator) return;
    const creatorId = JSON.parse(creator).id;

    try {
      const res = await creatorService.getTicketSummary(
        creatorId,
        currentPage,
        buyersPerPage,
        selectedEvent._id
      );

      const data = res.summary || [];
      const updatedSelectedEvent = data.find((event: EventGroup) => event._id === selectedEvent._id);

      if (updatedSelectedEvent) {
        setSelectedEvent(updatedSelectedEvent);
        setEventData(prevData =>
          prevData.map(event =>
            event._id === selectedEvent._id ? updatedSelectedEvent : event
          )
        );
      }

      setBuyersLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load buyers data");
      setBuyersLoading(false);
    }
  };

  if (selectedEvent) {
    fetchEventBuyers();
  }
}, [selectedEvent?._id, currentPage]);

  const handleEventClick = (event: EventGroup) => {
    setSelectedEvent(event);
    setCurrentPage(1); 
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (selectedEvent && currentPage < selectedEvent.totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-4xl font-bold mb-10 text-black drop-shadow-sm">Event Ticket Sales Summary</h1>

        {loading ? (
          <p className="text-lg text-gray-500 animate-pulse">Loading...</p>
        ) : error ? (
          <p className="text-red-600 bg-red-100 px-4 py-2 rounded shadow-sm inline-block">{error}</p>
        ) : eventData.length === 0 ? (
          <p className="text-gray-600 text-lg">No ticket data found.</p>
        ) : (
          <>
            <div className="flex flex-wrap gap-4 mb-10">
              {eventData.map((event) => (
                <button
                  key={event._id}
                  onClick={() => handleEventClick(event)}
                  className={`flex items-center gap-3 p-4 rounded-xl shadow-md border border-gray-200 transition-all ${
                    selectedEvent?._id === event._id
                      ? "bg-indigo-100 border-indigo-400"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <img src={event.eventImage} alt={event.eventName} className="w-14 h-14 object-cover rounded-md" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-800">{event.eventName}</div>
                    <div className="text-sm text-gray-500">{event.totalBuyers} buyers</div>
                  </div>
                </button>
              ))}
            </div>

            {selectedEvent && (
              <div className="space-y-6">
                <div className="flex items-center gap-6 mb-4">
                  <img
                    src={selectedEvent.eventImage}
                    alt={selectedEvent.eventName}
                    className="w-24 h-24 object-cover rounded-xl border border-gray-300"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedEvent.eventName}</h2>
                    <p className="text-gray-600 mt-1">🎫 Tickets Sold: <span className="font-semibold">{selectedEvent.ticketsSold}</span></p>
                    <p className="text-gray-600">💰 Revenue: <span className="font-semibold text-green-600">₹{selectedEvent.totalRevenue}</span></p>
                    <p className="text-gray-600">👥 Total Buyers: <span className="font-semibold">{selectedEvent.totalBuyers}</span></p>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                  <table className="min-w-full text-sm divide-y divide-gray-200">
                    <thead className="bg-indigo-50 text-black">
                      <tr>
                        <th className="px-5 py-3 text-left font-semibold">👤 Name</th>
                        <th className="px-5 py-3 text-left font-semibold">📧 Email</th>
                        <th className="px-5 py-3 text-right font-semibold">💵 Amount</th>
                        <th className="px-5 py-3 text-right font-semibold">🗓️ Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {buyersLoading ? (
                        <tr>
                          <td colSpan={4} className="px-5 py-8 text-center text-gray-500">
                            <div className="animate-pulse">Loading buyers...</div>
                          </td>
                        </tr>
                      ) : selectedEvent.buyers.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-5 py-8 text-center text-gray-500">
                            No buyers found for this event.
                          </td>
                        </tr>
                      ) : (
                        selectedEvent.buyers.map((buyer, i) => (
                          <tr key={i} className="hover:bg-indigo-50 transition">
                            <td className="px-5 py-3 text-gray-800 font-medium">{buyer.name}</td>
                            <td className="px-5 py-3 text-gray-600">{buyer.email}</td>
                            <td className="px-5 py-3 text-right text-green-600 font-semibold">₹{buyer.price}</td>
                            <td className="px-5 py-3 text-right text-gray-500">
                              {new Date(buyer.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {selectedEvent.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-6">
                    <button
                      disabled={currentPage === 1 || buyersLoading}
                      onClick={handlePreviousPage}
                      className="px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 font-medium">
                        Page {selectedEvent.currentPage} of {selectedEvent.totalPages}
                      </span>
                     
                    </div>
                    <button
                      disabled={currentPage === selectedEvent.totalPages || buyersLoading}
                      onClick={handleNextPage}
                      className="px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Account;