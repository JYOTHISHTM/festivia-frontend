import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { creatorService } from '../../services/creator/creatorService';
import SidebarNavigation from '../layout/creator/SideBar';

const PostDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);

useEffect(() => {
  const fetchEvent = async () => {
    try {
      const data = await creatorService.getEventPostById(id as any);
      setEvent(data);
    } catch (error) {
      console.error("❌ Failed to fetch event:", error);
    }
  };

  if (id) {
    fetchEvent();
  }
}, [id]);


  if (!event) return <div>Loading...</div>;

  return (
    <div className="bg-white flex min-h-screen">
      {/* Sidebar */}
      <SidebarNavigation />

      {/* Main Content */}
      <div className=' ml-50' >

        <div className="flex-1 p-8 overflow-auto  ">
          {/* Main Image */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Post Details</h2>
            <img
              src={event.mainImage}
              alt={event.eventName}
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">{event.eventName}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-8">
            {event.location && (
              <div className="p-4 bg-blue-100 rounded-lg shadow">
                📍 <strong>Location:</strong> {event.location}
              </div>
            )}

            {event.date && (
              <div className="p-4 bg-yellow-100 rounded-lg shadow">
                📅 <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
              </div>
            )}

            {event.totalTicketsSold > 0 && (
              <div className="p-4 bg-pink-100 rounded-lg shadow">
                🎟 <strong>Tickets Sold:</strong> {event.totalTicketsSold}
              </div>
            )}

            {event.totalRevenue > 0 && (
              <div className="p-4 bg-purple-100 rounded-lg shadow">
                💰 <strong>Total Revenue:</strong> ₹{event.totalRevenue.toFixed(2)}
              </div>
            )}

            {event.eventType && (
              <div className="p-4 bg-red-100 rounded-lg shadow">
                🎉 <strong>Type:</strong> {event.eventType}
              </div>
            )}
          </div>



          <div className="flex flex-wrap gap-6 mb-10">
            {event.category && (
              <div className="flex flex-col">
                <p className="text-sm font-semibold mb-1">Category:</p>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {event.category}
                </span>
              </div>
            )}
            {event.eventType && (
              <div className="flex flex-col">
                <p className="text-sm font-semibold mb-1">Event Type:</p>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {event.eventType}
                </span>
              </div>
            )}
            {event.subCategory && (
              <div className="flex flex-col">
                <p className="text-sm font-semibold mb-1">Sub Category:</p>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  {event.subCategory}
                </span>
              </div>
            )}
          </div>

          {/* Gallery Section */}
          {event.additionalImages?.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">📸 Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {event.additionalImages.map((img: string, index: number) => (
                  <img
                    key={index}
                    src={img}
                    alt={`gallery-${index}`}
                    className="rounded-lg h-40 object-cover w-full"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

};

export default PostDetails;
