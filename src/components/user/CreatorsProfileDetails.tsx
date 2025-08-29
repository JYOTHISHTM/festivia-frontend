import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { userService } from "../../services/user/userService";
import { Link } from "react-router-dom";
import HomeNavbar from '../layout/user/HomeNavbar';
import Footer from "../layout/user/Footer";
import { useNavigate } from "react-router-dom";


type Profile = {
    profileName: string;
    profileBio: string;
    eventCount: number;
    eventTypes: string[];
    profileImage: string;
};

interface Event {
    _id: string;
    eventName: string;
    mainImage: string;
    date: string;
    location: string;
    totalTicketsSold: number;
    eventType: string;
}

function CreatorsProfileDetails() {
    const navigate = useNavigate();

    const { id } = useParams();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [events, setEvents] = useState<Event[]>([]);

   useEffect(() => {
  const fetchProfile = async () => {
    const response = await userService.getCreatorProfile(id as any);
    if (response.success) {
      setProfile(response.data);
    } else {
      console.error("Failed to load profile:", response.error);
    }
  };

  if (id) fetchProfile();
}, [id]);


 useEffect(() => {
  const fetchEvents = async () => {
    if (!id) {
      console.error("Creator ID from URL is missing");
      return;
    }

    const response = await userService.getCreatorPosts(id);
    if (response.success) {
      setEvents(response.data);
    } else {
      console.error("Error fetching events:", response.error);
    }
  };

  fetchEvents();
}, [id]);

    if (!profile) {
        return <div className="text-center py-10 text-gray-500">Loading profile...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-blue-50">
            <HomeNavbar />

            <div className="max-w-5xl mx-auto px-6 pt-24 pb-12">
                {/* Banner with Glass Overlay */}
                <div className="relative h-64 w-full mb-20">
                    <img
                        src={profile.profileImage}
                        alt="Banner"
                        className="h-full w-full object-cover rounded-2xl shadow-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-900/70 to-gray-900/70  rounded-2xl"></div>
                    <img
                        src={profile.profileImage}
                        alt={profile.profileName}
                        className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border-4 border-white shadow-xl object-cover transition duration-300 hover:scale-105"
                    />
                </div>

                {/* Profile Info */}
                <div className="bg-blue-50 p-4 rounded-xl shadow-md mt-5 max-w-3xl mx-auto">
                    <h2 className="text-black text-3xl font-semibold mb-2 text-center">{profile.profileName}</h2>
                    <p className="text-gray-800 text-base font-medium leading-relaxed text-center">{profile.profileBio}</p>
                </div>




                {/* Stats Cards */}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl text-center shadow-lg transition transform duration-300 hover:scale-105 hover:shadow-xl">
                        <p className="text-4xl font-bold">{profile.eventCount}</p>
                        <p className="text-gray-600">Events Crafted</p>
                    </div>
                    <div className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg transition transform duration-300 hover:scale-105 hover:shadow-xl ">
                        <p className="text-gray-700 font-semibold mb-3 flex items-center justify-center">Event Specialties</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {profile.eventTypes.map((type, i) => (
                                <span
                                    key={i}
                                    className="text-xs bg-white/80 border border-gray-300 rounded-lg text-black font-semibold px-4 py-2 "
                                >
                                    {type}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>


              


                <div className="mt-10 flex justify-center">
                    {/* //creator profile detaials */}
                    <div
                        className="flex items-center space-x-3 border border-green-500 rounded-lg p-2 shadow-md hover:shadow-lg hover:bg-green-50 transition-all cursor-pointer"
                        onClick={() => navigate(`/user/chat/${id}`)}
                    >
                        {/* WhatsApp Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-green-600"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {/* path here */}
                        </svg>
                        <h3 className="text-1xl font-semibold text-green-700">WhatsApp</h3>
                    </div>
                </div>

                {/* Event Highlights */}
                <div className="mt-16">
                    <h3 className="text-2xl font-bold text-gray-800 mb-10 text-center">
                        Event Highlights
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <Link
                                to={`/user/post-details-page/${event._id}`}
                                key={event._id}
                                className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all p-5 flex flex-col"
                            >
                                <div className="relative h-48 mb-4 overflow-hidden rounded-xl">
                                    <img
                                        src={event.mainImage}
                                        alt={event.eventName}
                                        className="w-full h-full object-cover transition duration-300 hover:scale-110"
                                    />
                                    {(event.eventType && event.eventType !== "") && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                                            <span className="text-xs text-white font-medium px-2 py-1 rounded-full bg-purple-500/70 backdrop-blur-sm">
                                                {event.eventType}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <h4 className="text-lg font-bold text-gray-800">{event.eventName}</h4>

                                {event.location && (
                                    <p className="text-sm text-gray-600 mt-1">{event.location}</p>
                                )}

                                {(event.date || event.totalTicketsSold > 0) && (
                                    <div className="flex justify-between items-center mt-3">
                                        {event.date && (
                                            <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                                        )}
                                        {event.totalTicketsSold > 0 && (
                                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                                                {event.totalTicketsSold} tickets sold
                                            </span>
                                        )}
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
}

export default CreatorsProfileDetails;