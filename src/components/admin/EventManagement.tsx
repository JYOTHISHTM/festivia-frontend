// @ts-nocheck


import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/admin/SideBar";
import Swal from "sweetalert2";
import { getEvents } from "../../services/admin/adminService";

interface Event {
  id: string;
  eventType: string;
  eventName: string;
  description: string;
  date: string;
  time: string;
  location: string;
  prize: number;
  creatorName: string;
  seatType: string;
  totalSeats: string;
  image: string;
}


const EventApproval = () => {
  const [events, setEvents] = useState([]);
  const eventList: Event[] = []; 


  useEffect(() => {
    const fetchEvents = async () => {
      const response = await getEvents()
      if (response.success) {
        setEvents(response.data);
      } else {
        Swal.fire("Error", response.error, "error");
      }
    };

    fetchEvents();
  }, []);

  const handleApprove = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to approve this event?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Approve!",
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#6B7280",
    }).then((result) => {
      if (result.isConfirmed) {
        setEvents(events.filter((event) => event.id !== id)); 
        Swal.fire("Approved!", "The event has been approved and published.", "success");
      }
    });
  };

  const handleReject = (id: string) => {
    Swal.fire({
      title: "Reject Event",
      input: "textarea",
      inputLabel: "Reason for rejection",
      inputPlaceholder: "Type your reason here...",
      inputAttributes: {
        "aria-label": "Reason for rejection",
      },
      showCancelButton: true,
      confirmButtonText: "Reject",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      preConfirm: (reason) => {
        if (!reason) {
          Swal.showValidationMessage("Please enter a reason");
        }
        return reason;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setEvents(events.filter((event) => event.id !== id)); 
        Swal.fire("Rejected!", `Reason: ${result.value}`, "info");
      }
    });
  };

  const formatDate = (dateString: string) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8 mt-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Event Approval Dashboard</h1>
            <p className="text-gray-600 mt-2">Review and manage event submissions</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Pending Review ({events.length})</h2>
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>

            {events.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">✓</div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">All caught up!</h3>
                <p className="text-gray-500">No events are waiting for review.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {events.map((event) => (


                  <div key={event.id} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="relative flex justify-between items-start">
                        {event.image && (
                          <img
                            src={event.image}
                            alt="Event"
                            className="absolute top-0 right-0 w-40 h-40 object-cover rounded-4xl border-10 border-white shadow-lg"
                          />
                        )}

                        <div>
                          <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full mb-3">
                            {event.eventType}
                          </span>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{event.eventName}</h3>
                          <p className="text-gray-600 mb-4">{event.description}</p>

                          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
                            <div>
                              <p className="text-gray-500 font-medium">Date & Time</p>
                              <p className="text-gray-800">{formatDate(event.date)}</p>
                              <p className="text-gray-800">{event.time}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 font-medium">Location</p>
                              <p className="text-gray-800">{event.location}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 font-medium">Ticket Price</p>
                              <p className="text-gray-800">{event.prize}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 font-medium">SeatType</p>
                              <p className="text-gray-800">{event.seatType}</p>
                            </div>
                            {event.seatType === "RESERVED" && (
                              <div>
                                <p className="text-gray-500 font-medium">TotalSeats</p>
                                <p className="text-gray-800">{event.totalSeats}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-800">{event.creatorName}</p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => handleReject(event.id)}
                            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleApprove(event.id)}
                            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm"
                          >
                            Approve
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>



                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventApproval;
