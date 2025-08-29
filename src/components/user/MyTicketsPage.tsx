import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../layout/user/SideBar";
import HomeNavbar from "../layout/user/HomeNavbar";
import { Scissors } from "lucide-react";
import Swal from 'sweetalert2';
import { userService } from "../../services/user/userService";
import { BASE_URL } from "../../config/config";
import { API_CONFIG } from "../../config/config";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

type Ticket = {
  _id: string;
  eventId: {
    eventName: string;
    location: string;
    daySelectionMode: 'single' | 'range';
    date?: Date;
    startDate?: Date;
    endDate?: Date;
    time: string;
    price: number;
    eventType: string;
    image: string;
    seatType: 'RESERVED' | 'GENERAL';
  };
  paymentStatus: string;
  price?: number;
  seats: number[];
};


const MyTicketsPage = () => {
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const fetchTickets = async (page = 1) => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        Toastify({
          text: "User not logged in",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          backgroundColor: "#ff4d4d",
          stopOnFocus: true
        }).showToast();
        return;
      }

      const user = JSON.parse(storedUser);
      const userId: string = user.id || user._id;

      const response = await userService.getUserTickets(userId, page);

      if (response.success) {
        setTickets(response.data.tickets);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
      } else {
        console.error("Ticket fetch error:", response.error);
      }
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      setLoading(false);
    }
  };





  useEffect(() => {
    fetchTickets();
  }, []);

  const canCancel = (eventDateStr: string) => {
    const eventDate = new Date(eventDateStr);
    const now = new Date();
    const diffInDays = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diffInDays >= 2;
  };


  const handleCancel = async (ticketId: string, price: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Only half the amount (₹${price / 2}) will be refunded.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it'
    });

    if (!result.isConfirmed) return;

    setCancelLoading(true);
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        await Swal.fire('Error', 'User not logged in', 'error');
        setCancelLoading(false);
        return;
      }
      const user = JSON.parse(storedUser);
      const userId = user.id || user._id;
      if (!userId) {
        await Swal.fire('Error', 'Invalid user data', 'error');
        setCancelLoading(false);
        return;
      }

      await axios.post(`${BASE_URL}${API_CONFIG.USER_ENDPOINTS.CANCEL_TICKET(userId, ticketId)}`);

      await Swal.fire('Cancelled', 'Ticket cancelled successfully and refund processed.', 'success');

      fetchTickets();
    } catch (error: any) {
      await Swal.fire('Failed', "Failed to cancel ticket: " + (error.response?.data?.error || error.message), 'error');
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-2xl font-bold text-indigo-600">Loading your tickets...</div>
    </div>;
  }

  // if (tickets.length === 0) {
  //   return <div className="flex flex-col items-center justify-center min-h-screen">
  //     <div className="text-2xl font-bold text-gray-700 mb-4">You have no tickets yet.</div>
  //     <p className="text-gray-500">Purchase tickets to see them here!</p>
  //   </div>;
  // }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 h-screen overflow-hidden">
      <HomeNavbar />

      <Sidebar />

      <div className="max-w-7xl mx-auto pt-16 px-4 h-full overflow-y-auto">

        {tickets.length > 0 ? (


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8 mt-10">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="relative w-full">
                <div className="bg-white rounded-xl overflow-hidden shadow-lg flex flex-col md:flex-row w-full h-[280px]">

                  <div className="md:w-2/5 bg-gradient-to-br from-green-400 to-green-500 p-4 flex flex-col justify-between relative h-full">
                    <div className="h-32 w-full mb-3 overflow-hidden rounded-lg">
                      <img
                        src={ticket.eventId.image}
                        alt={ticket.eventId.eventName}
                        className="object-cover h-full w-full rounded-lg transition-transform hover:scale-105 duration-500"
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-center">
                      <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{ticket.eventId.eventName}</h3>
                      <p className="text-green-100 text-sm font-medium">{ticket.eventId.eventType}</p>
                    </div>
                    <div className="absolute bottom-3 right-3 text-white text-2xl font-extrabold opacity-15 rotate-12">
                      FESTIVIA
                    </div>
                  </div>

                  <div className="absolute top-1/2 left-2/5 transform -translate-y-1/2 -translate-x-1/2 hidden md:block z-10">
                    <div className="h-full border-r-2 border-dashed border-gray-300 absolute"></div>
                    <div className="bg-white rounded-full p-2 shadow-md absolute -left-4 -top-3">
                      <Scissors size={18} className="text-gray-500" />
                    </div>
                  </div>

                  <div className="md:w-3/5 p-4 flex flex-col justify-between h-full">
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-3">
                        <h2 className="text-lg font-bold text-gray-800 pr-3 line-clamp-2 flex-grow">{ticket.eventId.eventName}</h2>
                        <div className="bg-green-100 text-green-800 font-bold px-3 py-1.5 rounded-lg text-base whitespace-nowrap">
                          ₹{ticket.eventId.price || ticket.price}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mb-3">

                        <div className="flex items-start space-x-2">
                          <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                            <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">LOCATION</p>
                            <p className="text-sm text-gray-800 font-medium truncate">{ticket.eventId.location}</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2">
                          <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                            <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">DATE</p>
                            <p className="text-sm text-gray-800 font-medium">
                              {ticket.eventId.daySelectionMode === 'single' && ticket.eventId.date && (
                                <>{new Date(ticket.eventId.date).toLocaleDateString()}</>
                              )}
                              {ticket.eventId.daySelectionMode === 'range' &&
                                ticket.eventId.startDate &&
                                ticket.eventId.endDate && (
                                  <>
                                    {new Date(ticket.eventId.startDate).toLocaleDateString()} -{' '}
                                    {new Date(ticket.eventId.endDate).toLocaleDateString()}
                                  </>
                                )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2">
                          <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                            <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">TIME</p>
                            <p className="text-sm text-gray-800 font-medium">{ticket.eventId.time}</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2">
                          <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                            <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2" />
                            </svg>
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">EVENT TYPE</p>
                            <p className="text-sm text-gray-800 font-medium">{ticket.eventId.eventType}</p>
                          </div>
                        </div>
                      </div>

                      <div className="h-10 mb-3">
                        {ticket.eventId.seatType === 'RESERVED' ? (
                          <div className="flex items-center space-x-2 bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded-lg text-sm h-full">
                            <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17h8a2 2 0 002-2v-5a2 2 0 00-2-2H8a2 2 0 00-2 2v5a2 2 0 002 2z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17v2a1 1 0 001 1h8a1 1 0 001-1v-2" />
                            </svg>
                            <span className="font-semibold whitespace-nowrap">Seats:</span>
                            <span className="text-gray-800 font-medium truncate">{ticket.seats.join(', ')}</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 bg-blue-50 border border-blue-200 text-blue-800 px-3 py-2 rounded-lg text-sm h-full">
                            <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="font-semibold">General Admission</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-dashed border-gray-300 pt-3 flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">TICKET ID</p>
                        <p className="font-mono text-gray-700 font-bold text-sm">{ticket._id.substring(0, 8).toUpperCase()}</p>
                      </div>

                      <div>
                        {ticket.eventId.seatType === 'GENERAL' &&
                          canCancel(ticket.eventId.date ? ticket.eventId.date.toString() : "") &&
                          ticket.paymentStatus !== "cancelled" ? (
                          <button
                            disabled={cancelLoading}
                            onClick={() => handleCancel(ticket._id, ticket.eventId.price)}
                            className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        ) : ticket.paymentStatus === "cancelled" ? (
                          <p className="text-red-600 font-semibold text-sm bg-red-50 px-2 py-1 rounded">Cancelled</p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-2 left-0 right-0 h-4 flex items-center justify-center">
                  <div className="flex space-x-1">
                    {[...Array(15)].map((_, i) => (
                      <div key={i} className="w-1.5 h-4 bg-white rounded-b-full shadow-sm"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        ) : (
          <div className="flex flex-col items-center justify-center h-40  bg-gray-200 mt-80 rounded-2xl">
            <h2 className="text-2xl font-bold text-black mb-4">
              You have no tickets yet.
            </h2>
            <p className="text-gray-600">
              Purchase tickets to see them here!
            </p>
          </div>



        )
        }



        {totalPages > 1 && (
          <div className="flex justify-center pb-6 space-x-4">
            <button
              onClick={() => fetchTickets(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-5 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 shadow-sm disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-base font-semibold text-gray-700 flex items-center px-3">Page {currentPage} of {totalPages}</span>

            <button
              onClick={() => fetchTickets(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTicketsPage;




