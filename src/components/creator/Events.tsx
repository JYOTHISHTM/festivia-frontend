import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { creatorService } from '../../services/creator/creatorService';
import SideBar from '../layout/creator/SideBar';

interface Event {
  _id: string;
  eventName: string;
  location: string;
  price: number;
  totalSeats: string;
  daySelectionMode: 'single' | 'range';
  date?: string;
  startDate?: string;
  endDate?: string; image?: string;
  time: string
  seatType: string
}

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [_, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);   
  const [totalPages, setTotalPages] = useState(1); 

  const navigate = useNavigate();
 const getCreatorId = () => {
    const stored = localStorage.getItem("creator");
    const parsed = stored ? JSON.parse(stored) : null;
    return parsed?.id || null;
  };
  useEffect(() => {
    const fetchEvents = async () => {
      const creatorId = getCreatorId();
      if (!creatorId) {
        setError("You must be logged in as a creator.");
        setLoading(false);
        return;
      }

      try {
        const data = await creatorService.getAllListedEvents(creatorId, page);
        setEvents(data.events || data);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [page]);

  useEffect(() => {
  console.log("selectedMedia:", totalPages);
}, [totalPages ]);


 if (loading) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '16px',
      padding: '20px'
    }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          style={{
            height: '120px',
            backgroundColor: '#e2e2e2',
            borderRadius: '8px',
            animation: 'pulse 1.5s infinite',
          }}
        />
      ))}

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden">

      <SideBar />
      <div className="flex-1 p-8 overflow-y-auto scrollbar-hide">
        <div className="flex space-x-6  items-center">
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 ">
          {events.map(event => (
            <div
              key={event._id}
              onClick={() => navigate(`/creator/event/${event._id}`)}
              className="bg-white w-70  mb-6   rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-transform transform hover:scale-105 p-3"
            >
              {event.image && (
                <div className="h-40 w-full mb-4">
                  <img
                    src={event.image}
                    alt="Event"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">
                      {event.daySelectionMode === 'single' && event.date && (
                        <>
                          {new Date(event.date).toLocaleDateString()} •{' '}
                          {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </>
                      )}
                      {event.daySelectionMode === 'range' && event.startDate && event.endDate && (
                        <>
                          {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()} • {event.time}
                        </>
                      )}
                    </p>

                    <h2 className="text-xl font-bold text-gray-800">{event.eventName}</h2>
                    <p className="text-sm text-gray-500">{event.location}</p>
                  </div>


                </div>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <div className="col-span-full text-center text-gray-600 font-semibold text-lg">
              No events found.
            </div>
          )}

        </div>



        {events.length > 0 && (
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-gray-700 font-medium">Page {page}</span>
            <button
              onClick={() => setPage(prev => prev + 1)}
              disabled={events.length < 6}  
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}


      </div>

    </div>

  );
};

export default EventsPage;
