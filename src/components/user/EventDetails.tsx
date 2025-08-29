import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../layout/user/HomeNavbar';
import { Link } from "react-router-dom";
import { BASE_URL } from '../../config/config';
import { API_CONFIG } from '../../config/config';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { useRef } from 'react';
import { userService } from '../../services/user/userService';
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";


interface Layout {
    _id: string;
    layoutType: 'normal' | 'centeredscreen' | 'withbalcony' | 'reclanar';
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
    earlyBirdTickets?: number;
    earlyBirdDiscount?: number;
    image?: string;
    creatorId: string;
    layoutId: Layout;
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


interface CreatorProfile {
    profileName: string;
    profileBio: string;
    eventCount: number;
    eventTypes: string[];
    profileImage: string;
}

const SkeletonLoader: React.FC = () => (
    <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-6xl w-full mt-12">
            <div className="bg-gray-200 p-6 rounded-lg flex flex-col md:flex-row gap-6 animate-pulse">
                <div className="w-full md:w-1/3 h-64 bg-gray-300 rounded-lg"></div>
                <div className="flex-1 space-y-4">
                    <div className="h-8 w-3/4 bg-gray-300 rounded"></div>
                    <div className="grid grid-cols-2 gap-4">
                        {Array(6).fill(0).map((_, i) => (
                            <div key={i} className="h-12 bg-gray-300 rounded-lg"></div>
                        ))}
                    </div>
                    <div className="h-6 w-1/2 bg-gray-300 rounded mt-4"></div>
                </div>
            </div>
        </div>
    </div>
);

const EventDetails: React.FC = () => {
    const mapRef = useRef<L.Map | null>(null);
    const { id } = useParams();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null);
    const [creatorId, setCreatorId] = useState(null);
    const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);

    const navigate = useNavigate()

    const handleBookTicket = async () => {
        try {
            const userString = localStorage.getItem('user');
            const user = userString ? JSON.parse(userString) : null;

            const userId: string | undefined = user?.id || user?._id;

            if (!userId) {
                Toastify({
                    text: "User not found",
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "#ff4d4d",
                    stopOnFocus: true
                }).showToast();
                return;
            }

            const response = await userService.bookTicket(userId, id as any);

            if (response.success && response.sessionUrl) {
                window.location.href = response.sessionUrl;
            } else {
                Toastify({
                    text: response.error || "Booking failed",
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "#ff4d4d",
                    stopOnFocus: true
                }).showToast();
            }

        } catch (error) {
            console.error("Booking failed:", error);
        }
    };




    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`${BASE_URL}${API_CONFIG.USER_ENDPOINTS.EVENT(id as string)}`);
                const eventData = response.data;
                setEvent(eventData);

                if (eventData.creatorId) {
                    setCreatorId(eventData.creatorId);
                    console.log("creatorId:", eventData.creatorId);

                    try {
                        const profileRes = await axios.get(
                            `${BASE_URL}${API_CONFIG.USER_ENDPOINTS.EVENT_PROFILE(eventData.creatorId)}`
                        );


                        setCreatorProfile(profileRes.data);
                    } catch (profileError: any) {
                        if (profileError.response?.status === 404) {
                            console.warn("No profile found for creator");
                            setCreatorProfile(null);
                        } else {
                            console.error("Error fetching profile:", profileError);
                            setError('Failed to fetch creator profile');
                        }
                    }
                }

                setLoading(false);
            } catch (error: any) {
                console.error("Error fetching event or profile:", error);
                setError('Failed to fetch event or profile data');
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);


    useEffect(() => {
        if (event?.location) {
            const fetchCoordinates = async () => {
                try {
                    const res = await axios.get(`https://nominatim.openstreetmap.org/search`, {
                        params: {
                            q: event.location,
                            format: 'json',
                        },
                        headers: {
                            'Accept-Language': 'en',
                        }
                    });

                    if (res.data && res.data.length > 0) {
                        setCoordinates({
                            lat: parseFloat(res.data[0].lat),
                            lon: parseFloat(res.data[0].lon),
                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch coordinates:", error);
                }
            };

            fetchCoordinates();
        }
    }, [event]);

    if (loading) return <SkeletonLoader />;
    if (error) return <div>{error}</div>;
    if (!event) return <div>No Event Data Found</div>;


    const handleProfile = () => {
        if (creatorId) {
            navigate(`/user/creator-profiles-details/${creatorId}`)
        }
    }


    return (
        <>
            <Navbar />
            <div className="flex flex-col min-h-screen bg-gray-200">
                <Navbar />
                {/* Breadcrumb */}
                <nav className="text-gray-600 text-sm px-6 bg-gray-200">
                    <Navbar />
                    <ul className="flex items-center font-bold text-xl space-x-2 mt-8">
                        <li>
                            <Link to="/user/home" className="text-gray-500 hover:text-black">Home</Link>
                        </li>
                        <span className="text-gray-400">/</span>
                        <li className="text-black">Event Details</li>
                    </ul>
                </nav>

                {/* Main Event Container */}
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-6xl w-full mt-8">
                        <div className="bg-gray-200 p-6 rounded-lg flex flex-col md:flex-row gap-6">
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
                                    )}

                                    {/* General Seat Price */}
                                    {event.seatType === 'GENERAL' && (
                                        <div className="bg-gray-300 p-2 rounded-lg text-center">
                                            TICKET PRICE: ₹{event.price}
                                        </div>
                                    )}

                                    <div className="bg-gray-300 p-2 rounded-lg text-center col-span-2">
                                        LOCATION: {event.location}
                                    </div>
                                </div>


                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-gray-200 p-4 rounded-lg mt-6 text-gray-700">
                            <p>{event.description}</p>
                        </div>

                        <div className="justify-center text-center mt-8">
                            <button
                                className="px-8 py-3 bg-black rounded-2xl font-medium text-white"
                                onClick={() => {
                                    if (event.seatType === 'GENERAL') {
                                        handleBookTicket();
                                    } else if (event.seatType === 'RESERVED') {
                                        navigate(`/user/booking/${event.layoutId._id}`);
                                    }
                                }}
                            >
                                BOOK TICKET
                            </button>
                        </div>








                    </div>
                </div>

                {/* Map Section */}
                {coordinates && (
                    <div className="w-full flex justify-center mt-10 mb-12">
                        <div className="max-w-6xl w-full px-4">
                            <div id="routing-container" style={{ display: 'none' }}></div>
                            <div className="w-full h-96 rounded-lg overflow-hidden shadow-md">
                                <MapContainer
                                    center={[coordinates.lat, coordinates.lon]}
                                    zoom={13}
                                    scrollWheelZoom={false}
                                    style={{ height: '100%', width: '100%' }}
                                    ref={mapRef}
                                    whenReady={() => {
                                        const map = mapRef.current;
                                        if (map && navigator.geolocation) {
                                            navigator.geolocation.getCurrentPosition((pos) => {
                                                const userLat = pos.coords.latitude;
                                                const userLon = pos.coords.longitude;

                                                L.Routing.control({
                                                    waypoints: [
                                                        L.latLng(userLat, userLon),
                                                        L.latLng(coordinates.lat, coordinates.lon)
                                                    ],
                                                    routeWhileDragging: false
                                                }).addTo(map);
                                            });
                                        }
                                    }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; OpenStreetMap contributors'
                                    />
                                    <Marker position={[coordinates.lat, coordinates.lon]}>
                                        <Popup>{event.location}</Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                            <div className="text-center mt-4">
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lon}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                                >
                                    Get Directions
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* Creator Profile */}
                {creatorProfile === null ? (
                    <div className="flex justify-center mb-20 px-4">
                        <div className="bg-white p-6 rounded-3xl shadow-xl max-w-6xl w-full text-center">
                            <div className="border border-dashed border-gray-300 p-6 rounded-2xl bg-gray-200 h-40 flex justify-center items-center">
                                <p className="text-gray-500 font-medium text-lg">
                                    No profile found for this creator.
                                </p>
                            </div>
                        </div>

                    </div>

                ) : creatorProfile && (
                    <div className="flex justify-center mb-20 px-4">
                        <div className="bg-white p-6 rounded-3xl shadow-xl max-w-5xl w-full">
                            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                                Creator Profile
                            </h2>
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                {/* Profile Image */}
                                <img
                                    src={creatorProfile.profileImage || "https://via.placeholder.com/100"}
                                    alt="Creator"
                                    className="w-28 h-28 md:w-42 md:h-42 object-cover rounded-2xl shadow-md"
                                />

                                {/* Creator Info */}
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                                        {creatorProfile.profileName}
                                    </h3>
                                    <p className="text-gray-600 mb-3">{creatorProfile.profileBio}</p>
                                    <p className="text-sm text-gray-500 mb-1">
                                        <span className="font-medium">Events Created:</span> {creatorProfile.eventCount}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        <span className="font-medium">Types:</span> {creatorProfile.eventTypes.join(', ')}
                                    </p>
                                </div>
                            </div>

                            {/* View Profile Button */}
                            <div className="w-full md:w-auto ml-190 mt-5">
                                <button
                                    onClick={handleProfile}
                                    className="bg-black hover:bg-gray-800 text-white font-semibold px-6 py-2 rounded-2xl w-full md:w-40 mt-4 md:mt-0"
                                >
                                    VIEW PROFILE
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </>

    );
};

export default EventDetails;
