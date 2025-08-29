import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { userService } from '../../services/user/userService';
import Navbar from '../layout/user/HomeNavbar';
import Footer from '../layout/user/Footer';

interface Event {
  _id: string;
  eventName: string;
  image?: string;
  eventType: string;
  price: number;
  date?: string;
  time?: string;
  location?: string;
  description?: string;
}

const EventPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const eventsPerPage = 6;

  const [filters, setFilters] = useState({
    search: '',
    location:'',
    eventType: '',
  
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const eventTypesRes = await userService.getEventTypes();

        if (eventTypesRes.success) {
          setEventTypes(eventTypesRes.data);
        } else {
          console.error('Failed to load event types:', eventTypesRes.error);
        }

        const eventsRes = await userService.getEvents({
          search: filters.search,
          location:filters.location,
          eventType: filters.eventType,
         
          page: currentPage,
          limit: eventsPerPage
        });

        if (eventsRes.success) {
          console.log('Events response:', eventsRes.data);
          setEvents(eventsRes.data.events || []);
          console.log("sdsadsadsad",eventsRes.data.events);
          
          setTotalEvents(eventsRes.data.total || 0);
          setTotalPages(eventsRes.data.pages || Math.ceil((eventsRes.data.total || 0) / eventsPerPage));
          setError(null);
        } else {
          setError(eventsRes.error);
          setEvents([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, currentPage]);

  useEffect(() => {
    console.log('Current filters:', filters);
    console.log('Current page:', currentPage);
    console.log('Total pages:', totalPages);
    console.log('Events count:', events.length);
  }, [filters, currentPage, totalPages, events]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
    setCurrentPage(1); 
  };


  const handleSearchLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, location: e.target.value }));
    setCurrentPage(1);
  };


  const handleTypeClick = (type: string) => {
    setFilters(prev => ({
      ...prev,
      eventType: prev.eventType === type ? '' : type,
    }));
    setCurrentPage(1); 
  };

  const handleClearFilters = () => {
    setFilters({
      location:'',
      search: '',
      eventType: '',
   
    });
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 10;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button
          key="first"
          onClick={() => goToPage(1)}
          className="mx-1 px-3 py-1 rounded text-blue-500 hover:bg-blue-100"
        >
          1
        </button>
      );

      if (startPage > 2) {
        pages.push(<span key="ellipsis1" className="mx-1">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`mx-1 px-3 py-1 rounded ${currentPage === i
              ? 'bg-blue-500 text-white'
              : 'text-blue-500 hover:bg-blue-100'
            }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis2" className="mx-1">...</span>);
      }

      pages.push(
        <button
          key="last"
          onClick={() => goToPage(totalPages)}
          className="mx-1 px-3 py-1 rounded text-blue-500 hover:bg-blue-100"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-10 mt-25 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Filter Events</h2>
            <button
              onClick={handleClearFilters}
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              Clear All
            </button>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by event name"
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by location "
              value={filters.location}
              onChange={handleSearchLocation}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Event Type</h3>
            <div className="grid grid-cols-2 gap-2">
              {eventTypes.map(type => (
                <button
                  key={type}
                  onClick={() => handleTypeClick(type)}
                  className={`w-full py-2 px-4 rounded-md text-white ${filters.eventType === type ? 'bg-blue-500' : 'bg-gray-500'
                    }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

        
        </div>

        <div className="w-full md:w-3/4">
          <h1 className="text-3xl font-semibold tracking-[0.2em] text-center mb-8">ALL EVENTS</h1>

          {loading ? (
            <div className="text-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4">Loading events...</p>
            </div>
          ) : error ? (
            <div className="text-center p-8 text-red-600">{error}</div>
          ) : events.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {events.map(event => (
                  <div
                    key={event._id}
                    onClick={() => navigate(`/user/event/${event._id}`)}
                    className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                  >
                    {event.image ? (
                      <img src={event.image} alt={event.eventName} className="w-full h-60 object-cover rounded-2xl" />
                    ) : (
                      <div className="w-full h-60 bg-gray-200 flex items-center justify-center rounded-2xl">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-white bg-opacity-95 px-4 py-2 rounded-full">
                        <p className="text-center text-sm font-medium truncate">{event.eventName}</p>
                        <div className="flex justify-between text-xs text-gray-600">
                        </div>
                      </div>
                    </div>
                    <div className="absolute right-4 bottom-4 text-white text-2xl opacity-75 group-hover:translate-x-2 transition-all duration-300">→</div>
                  </div>
                ))}
              </div>


              {/* Event count and pagination info */}
              <div className="mt-6 text-center text-gray-600">
                Showing {events.length} of {totalEvents} events
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  <nav className="flex items-center">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`mx-1 px-3 py-1 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-100'
                        }`}
                    >
                      Previous
                    </button>

                    {renderPagination()}

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`mx-1 px-3 py-1 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-100'
                        }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="text-center p-12 bg-gray-50 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No events found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search terms.</p>
              <p className="mt-2 text-sm">
                <button
                  onClick={handleClearFilters}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Clear all filters
                </button>
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default EventPage;