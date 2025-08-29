import { useEffect, useState } from 'react';
import { userService } from '../../services/user/userService';
import HomeNavbar from '../layout/user/HomeNavbar'
import Footer from '../layout/user/Footer';
import { Link } from "react-router-dom";



type Profile = {

  creator: string;
  profileName: string;
  profileBio: string;
  eventCount: number;
  eventTypes: string[];
  profileImage: string;
};

function PrivateEventCreators() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchProfiles = async () => {
    const response = await userService.getAvailablePrivateEventCreators();

    if (response.success) {
      setProfiles(response.data);
    } else {
      console.error("Error fetching profiles:", response.error);
    }

    setLoading(false);
  };

  fetchProfiles();
}, []);


  if (loading) return <div className="text-center py-10 text-gray-600">Loading profiles...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-indigo-100">
      <HomeNavbar />

      <main className="flex-1 px-4 py-10">
        {/* Top Section */}
        <div className="mx-auto mt-16 mb-16 max-w-4xl bg-black rounded-xl text-center flex flex-col justify-center px-6 py-6">
          <h1 className="text-4xl font-extrabold text-purple-800 mb-2">
            Meet Our Event Creators
          </h1>
          <p className="text-white italic max-w-xl mx-auto">
            “Events become memories when crafted with passion. Meet the magicians behind the magic.”
          </p>
        </div>

        {/* Profile Cards */}
        {/* Profile Cards or No Data Message */}
        <div className="max-w-4xl mx-auto">
          {profiles.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-10 text-center text-gray-600 text-lg">
              No profiles available
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {profiles.map((profile: any, index) => (
                <Link to={`/user/creator-profiles-details/${profile.creator}`} key={index}>
                  <div className="bg-white rounded-2xl shadow-xl p-6 relative overflow-hidden hover:shadow-2xl transition hover:scale-[1.015] duration-200 h-full flex flex-col">
                    {/* Image */}
                    <div className="w-full h-48 rounded-xl overflow-hidden mb-4">
                      <img
                        src={profile.profileImage}
                        alt={profile.profileName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Name + Bio */}
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">{profile.profileName}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">{profile.profileBio}</p>

                    {/* Event Info */}
                    <p className="text-sm font-medium text-indigo-600 mb-1">
                      Events Crafted: <span className="text-gray-800">{profile.eventCount}</span>
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.eventTypes.map((type: string, i: number) => (
                        <span
                          key={i}
                          className="text-xs bg-indigo-100 text-indigo-700 font-medium px-3 py-1 rounded-full"
                        >
                          {type}
                        </span>
                      ))}
                    </div>

                    {/* Colorful Glow Background */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-300 rounded-full opacity-20 blur-2xl"></div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>



        {/* Bottom Section */}
        <div className="text-center mt-32 mb-10 text-purple-800 px-4">
          <h2 className="text-xl font-bold mb-2">🎉 Did You Know?</h2>
          <p className="text-gray-700 max-w-xl mx-auto">
            The largest event ever planned involved over 3 million attendees — all organized by creative professionals like these!
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );

}

export default PrivateEventCreators;
