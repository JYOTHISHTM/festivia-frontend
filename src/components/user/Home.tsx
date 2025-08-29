import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/user/userService';
import Navbar from '../layout/user/HomeNavbar';
import Footer from '../layout/user/Footer';
import image from '../../assets/images/pexels-pixabay-265856.jpg';
import image2 from '../../assets/images/pexels-emma-bauso-1183828-2253842.jpg';
import image3 from '../../assets/images/pexels-elijahsad-8038906.jpg';
import image4 from '../../assets/images/pexels-ron-lach-10024444.jpg';
import image5 from '../../assets/images/pexels-ownfilters-6308423.jpg';
import image6 from '../../assets/images/pexels-pavel-danilyuk-6405783.jpg';
import emptyBox from "../../assets/images/empty-box.png";
import Eimage1 from '../../assets/images/pexels-isabella-mendes-107313-332688.jpg';

interface Event {
  _id: string;
  eventName: string;
  image?: string;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  image6?: string;
  eventType: string;
}

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [localEvents, setLocalEvents] = useState<Event[] | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvents, setCurrentEvents] = useState<Event[]>([]);

  const navigate = useNavigate();
  const eventsPerPage = 6;

  const DefaultEventType = [
    { title: 'WEDDING EVENTS', image1: image2 },
    { title: 'BIRTHDAY PARTY', image1: image5 },
    { title: 'MUSIC EVENTS', image1: image3 },
    { title: 'RETIREMENT PARTY', image1: image6 },
    { title: 'ENGAGEMENT', image1: image },
    { title: 'HOUSE WARMING', image1: image4 },
  ];

  const HandleCreators = () => {
    const route = `/user/all-private-creators-profiles`;
    navigate(route);
  };
  const images = [Eimage1];



  useEffect(() => {
    const fetchHomeEvents = async () => {
      const response = await userService.getHomeEvents();
      if (response.success) {
        setCurrentEvents(response.data);
      } else {
        setError(response.error as any);
      }
      setLoading(false);
    };

    fetchHomeEvents();
  }, []);





  const fetchEvents = async () => {
    const response = await userService.getEventsByLocation();

    if (!response.success) {
      console.error(response.error);
      return;
    }

    const { message, events, location } = response.data;

    if (message === 'no_location') {
      setUserLocation('');
      setLocalEvents([]);
      setLocation('');
    } else if (message === 'no_events') {
      setUserLocation(location);
      setLocalEvents([]);
      setLocation(location);
    } else {
      setUserLocation(location);
      setLocalEvents(events);
      setLocation(location);
    }

    setIsEditing(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);



  const saveLocation = async () => {
    try {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;

        const response = await userService.saveUserLocation(location, latitude, longitude);

        if (response.success) {
          setUserLocation(location);
          setIsEditing(false);
          fetchEvents();
        } else {
          console.error(response.error);
        }
      }, (err) => {
        console.error("Error fetching GPS", err);
      });
    } catch (err) {
      console.error('Failed to save location', err);
    }
  };




  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="h-16 w-full bg-gray-300 animate-pulse rounded-md mb-5" />
        <div className="w-full h-[500px] bg-gray-300 animate-pulse rounded-lg mb-12" />
        <h1 className="text-2xl font-semibold text-center mb-12 animate-pulse bg-gray-300 w-1/3 mx-auto h-6 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(eventsPerPage)].map((_, index) => (
            <div key={index} className="h-72 bg-gray-300 animate-pulse rounded-2xl shadow-md" />
          ))}
        </div>
      </div>
    );
  }

  if (error) return <div>{error}</div>;


  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-8 mt-20">

        {/* Carousel */}
        <div className="relative w-full overflow-hidden mb-12">
          <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar">
            {images.map((src, index) => (
              <div key={index} className="flex-shrink-0 w-full snap-center">
                <div className="relative h-[500px] w-[1000px] mx-4">
                  <img src={src} className="object-cover w-full h-full rounded-lg shadow-xl" alt={`Event image ${index + 1}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Public Events */}

        <div className="mb-12 ">
          <h1 className="text-3xl font-semibold text-center mb-12">PUBLIC EVENTS</h1>

          {currentEvents?.length > 0 && (
            <div className="p-8">
              {/* Location Input */}
              <input
                type="text"
                placeholder="Enter your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={!isEditing}
                className={`border px-3 py-2 mr-2 rounded ${isEditing ? '' : 'bg-gray-100'}`}
              />
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-yellow-500 px-6 py-2 text-white rounded"
                >
                  Edit
                </button>
              ) : (
                <button
                  onClick={saveLocation}
                  className="bg-black px-6 py-2 text-white rounded"
                >
                  Save
                </button>
              )}
            </div>
          )}







          {/* Event Content */}
          <div className="p-6 ">
            {userLocation && localEvents && localEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {localEvents.map((event) => (
                  <div
                    key={event._id}
                    onClick={() => navigate(`/user/event/${event._id}`)}
                    className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                  >
                    <img
                      src={event.image}
                      alt={event.eventName}
                      className="w-full h-60 object-cover rounded-2xl"
                    />
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-white bg-opacity-95 px-4 py-1.5 rounded-full">
                        <p className="text-center text-xs font-medium">{event.eventName}</p>
                      </div>
                    </div>
                    <div className="absolute right-4 bottom-4 text-white text-2xl opacity-75 group-hover:translate-x-2 transition-all duration-300">→</div>
                  </div>
                ))}
              </div>
            ) : userLocation && localEvents?.length === 0 ? (
              <>
                <div className="bg-red-100 text-red-700 text-center p-6 mb-6 rounded-lg shadow">
                  No events found near <strong>{userLocation}</strong>. Check out these general events instead!
                </div>
                {currentEvents?.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {currentEvents.map((event) => (
                      <div
                        key={event._id}
                        onClick={() => navigate(`/user/event/${event._id}`)}
                        className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                      >
                        <img
                          src={event.image}
                          alt={event.eventName}
                          className="w-full h-60 object-cover rounded-2xl"
                        />
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="bg-white bg-opacity-95 px-4 py-1.5 rounded-full">
                            <p className="text-center text-xs font-medium">{event.eventName}</p>
                          </div>
                        </div>
                        <div className="absolute right-4 bottom-4 text-white text-2xl opacity-75 group-hover:translate-x-2 transition-all duration-300">→</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : !userLocation ? (
              <>
                {currentEvents?.length === 0 ? (

                  <div className="flex flex-col items-center justify-center bg-green-50 p-10 rounded-2xl shadow-lg border border-white">
                    <img src={emptyBox} alt="No events" className="w-56 h-56 mb-6" />

                    <h2 className="text-2xl font-semibold text-green-700 mb-2">
                      No Events Available
                    </h2>
                    <p className="text-green-600 text-center max-w-xs">
                      We couldn’t find any events right now.
                      Please check back later.
                    </p>
                  </div>


                ) : (

                  <div className="bg-yellow-100 text-yellow-800 text-center p-6 mb-6 rounded-lg shadow">
                    Please enter your location to find events near you.
                  </div>
                )}
                {currentEvents?.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
                    {currentEvents.map((event) => (
                      <div
                        key={event._id}
                        onClick={() => navigate(`/user/event/${event._id}`)}
                        className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                      >
                        <img
                          src={event.image}
                          alt={event.eventName}
                          className="w-full h-60 object-cover rounded-2xl"
                        />
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="bg-white bg-opacity-95 px-4 py-1.5 rounded-full">
                            <p className="text-center text-xs font-medium">{event.eventName}</p>
                          </div>
                        </div>
                        <div className="absolute right-4 bottom-4 text-white text-2xl opacity-75 group-hover:translate-x-2 transition-all duration-300">→</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : null}
          </div>



          {/* View All Events Button */}
          {currentEvents?.length > 0 && (

            <div className="flex justify-center mt-10">
              <button
                onClick={() => navigate('/user/all-public-events')}
                className="px-7 py-3 border-2 border-transparent text-white rounded-2xl transition-all duration-500 bg-black hover:bg-green-400 hover:text-black hover:border-green-500"
              >
                View All Events
              </button>
            </div>
          )}
        </div>



        <hr className="pb-10 pt-10 border-gray-500" />

        <div>
          <h1 className="text-2xl font-semibold text-center mb-12">CREATE YOUR OWN EVENTS</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DefaultEventType.map((event) => (
              <div
                key={event.title}
                className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={event.image1}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center rounded-2xl">
                  <p className="text-white text-lg font-medium tracking-widest">{event.title}</p>
                </div>
                <div className="absolute right-4 bottom-4 text-white text-2xl opacity-75 group-hover:translate-x-2 transition-all duration-300">
                </div>
              </div>
            ))}
          </div>

        </div>
        <div className='p-4  mt-5 flex items-center justify-center'>

          <button className='bg-green-300 w-90 p-3  rounded-2xl font-medium' onClick={HandleCreators}>    FOUND CREATORS
          </button>
        </div>


      </div>
      <Footer />
    </>
  );
};

export default HomePage;
