import { useState, useEffect } from "react";
import SidebarNavigation from "../layout/creator/SideBar";
import { useNavigate } from "react-router";
import { creatorService } from "../../services/creator/creatorService"
import { getCreatorPosts, updateProfileImage } from "../../services/creator/creatorService";


interface Event {
  _id: string;
  eventName: string;
  mainImage: string
  eventTime: string;
  date: string;
  location: string;
  description: string;
  time: string;
  totalTicketsSold: number;
  totalRevenue: number;
  eventType: string;
}


const HeroSection = () => {
  const [profileName, setProfileName] = useState("****");
  const [profileBio, setProfileBio] = useState("****");
  const [eventCount, setEventCount] = useState("****");
  const [profileImage, setProfileImage] = useState("****");
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [newEventType, setNewEventType] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [profileExists, setProfileExists] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});


  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");

  const startEditing = (field: any, value: any) => {
    setEditingField(field);
    setTempValue(value);
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSave = async () => {
    if (!editingField) return;

    const trimmed = tempValue.trim();
    const isTextInvalid = trimmed.replace(/[^a-zA-Z0-9]/g, '').length < 3;

    if (isTextInvalid) {
      setFormErrors((prev) => ({
        ...prev,
        [editingField]: "Please enter at least 3 meaningful characters",
      }));
      return;
    }

    setFormErrors((prev) => ({ ...prev, [editingField]: "" }));

    try {
      const creatorString = localStorage.getItem("creator");
      const creator = creatorString ? JSON.parse(creatorString) : null;

      if (!creator?.id) {
        console.error("Creator ID not available");
        return;
      }

      await creatorService.updateEventProfileField(
        creator.id,
        editingField,
        trimmed
      );

      if (editingField === "profileName") setProfileName(trimmed);
      if (editingField === "profileBio") setProfileBio(trimmed);
      if (editingField === "eventCount") setEventCount(trimmed);

      setEditingField(null);
    } catch (error) {
      console.error("Failed to update:", error);
    }
  };

  useEffect(() => {
    console.log("selectedMedia:", profileExists);
  }, [profileExists]);

  const addEventType = async () => {
    const trimmed = newEventType.trim();

    if (!trimmed || /^[^a-zA-Z0-9]*$/.test(trimmed) || trimmed.length < 3) {
      setFormErrors((prev) => ({
        ...prev,
        newEventType: "Please enter a valid event type (at least 3 alphanumeric characters)",
      }));
      return;
    }

    setFormErrors((prev) => ({ ...prev, newEventType: "" })); // Clear error

    const creatorString = localStorage.getItem("creator");
    const creator = creatorString ? JSON.parse(creatorString) : null;

    if (!creator?.id) {
      console.error("Creator ID not available");
      return;
    }

    try {
      const updatedTypes = [...eventTypes, trimmed];

      await creatorService.updateEventProfileType(
        creator.id,
        "eventTypes",
        updatedTypes
      );

      setEventTypes(updatedTypes);
      setNewEventType("");
    } catch (error) {
      console.error("Failed to add event type:", error);
    }
  };

  const removeEventType = async (index: number) => {
    const creatorString = localStorage.getItem("creator");
    const creator = creatorString ? JSON.parse(creatorString) : null;

    if (!creator?.id) {
      console.error("Creator ID not available");
      return;
    }

    try {
      const updatedTypes = [...eventTypes];
      updatedTypes.splice(index, 1);

      await creatorService.updateEventProfile(creator.id, "eventTypes", updatedTypes);
      setEventTypes(updatedTypes);
    } catch (error) {
      console.error("Failed to remove event type:", error);
    }
  };

  const fetchProfile = async () => {
    try {
      const creatorString = localStorage.getItem("creator");
      const creator = creatorString ? JSON.parse(creatorString) : null;
      const creatorId = creator?.id;

      if (!creatorId) {
        console.error("Creator ID is not available");
        setProfileExists(false);
        return;
      }

      const data = await creatorService.getEventProfileInfo(creatorId);

      if (!data || Object.keys(data).length === 0) {
        setProfileExists(false);
        return;
      }

      const { profileName, profileImage, profileBio, eventCount, eventTypes = [] } = data;

      setProfileExists(true);
      setProfileName(profileName || "");
      setProfileBio(profileBio || "");
      setEventCount(eventCount || 0);
      setEventTypes(eventTypes || []);
      setProfileImage(profileImage || "/default-profile.png");
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfileExists(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const navigate = useNavigate()

  const handleBoxClick = (id: string) => {
    navigate(`/creator/post-details/${id}`);
  };

  const handleFormClick = () => {
    navigate(`/creator/add-post-form`);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      const creatorString = localStorage.getItem("creator");
      const creator = creatorString ? JSON.parse(creatorString) : null;

      if (!creator?.id) {
        console.error("Creator ID not found");
        return;
      }

      try {
        const result = await getCreatorPosts(creator.id);
        setEvents(result.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, []);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormErrors((prev) => ({ ...prev, profileImage: "" }));
      
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setFormErrors((prev) => ({
          ...prev,
          profileImage: "Only image files (JPG, PNG, WEBP) are allowed"
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setFormErrors((prev) => ({
          ...prev,
          profileImage: "File size must be less than 5MB"
        }));
        return;
      }

      setNewImageFile(file);
      setIsEditingImage(true);
    }
  };

  const handleSaveImage = async () => {
    if (!newImageFile) return;

    const creatorString = localStorage.getItem("creator");
    const creator = creatorString ? JSON.parse(creatorString) : null;

    if (!creator?.id) {
      console.error("Creator ID not available");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", newImageFile);
    formData.append("creatorId", creator.id);

    try {
      setIsSaving(true);
      const res = await updateProfileImage(formData);
      setProfileImage(res.data.profileImage);
      setNewImageFile(null);
      setIsEditingImage(false);
      setFormErrors((prev) => ({ ...prev, profileImage: "" }));
    } catch (error) {
      console.error("Error uploading image:", error);
      setFormErrors((prev) => ({
        ...prev,
        profileImage: "Failed to upload image. Please try again."
      }));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarNavigation />
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-inner overflow-hidden">

          <div className="bg-black h-40 w-full"></div>
          <div className="px-8 pb-10 relative">

            <div className="flex flex-col items-center -mt-20">
              <img
                src={newImageFile ? URL.createObjectURL(newImageFile) : profileImage}
                alt="Profile"
                className="w-40 h-40 rounded-lg object-cover border-4 border-white shadow-md"
              />

              <label className="mt-2 text-blue-600 text-sm cursor-pointer hover:underline">
                Edit Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>

              {/* Image Error Message */}
              {formErrors.profileImage && (
                <p className="text-red-500 text-xs mt-1 text-center">{formErrors.profileImage}</p>
              )}

              {isEditingImage && !formErrors.profileImage && (
                isSaving ? (
                  <div className="mt-2 flex items-center justify-center">
                    <div className="w-6 h-6 border-[3px] border-blue-500 border-dashed rounded-full animate-spin"></div>
                    <span className="ml-2 text-blue-500 text-sm">Saving...</span>
                  </div>
                ) : (
                  <button
                    onClick={handleSaveImage}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                  >
                    Save
                  </button>
                )
              )}

            </div>

            <div className="absolute top-4 right-8">
              <div className="bg-white shadow-inner border rounded-xl px-5 py-3">
                {editingField === "eventCount" ? (
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-700">Events Hosted:</span>
                      <input
                        type="number"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className={`border rounded px-2 py-1 w-20 text-center ${formErrors.eventCount ? 'border-red-500' : ''}`}
                        autoFocus
                      />
                      <button
                        onClick={handleSave}
                        className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                    </div>
                    {formErrors.eventCount && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.eventCount}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-gray-700 font-medium">Events Hosted:</span>
                    <span className="text-blue-600 font-bold">{eventCount}</span>
                    <button
                      onClick={() => startEditing("eventCount", eventCount)}
                      className="text-xs text-blue-500 hover:text-blue-700 px-2 py-1 border rounded"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 text-center">
              {editingField === "profileName" ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className={`border px-4 py-2 rounded w-full max-w-lg ${formErrors.profileName ? 'border-red-500' : ''}`}
                      autoFocus
                    />
                    <button
                      onClick={handleSave}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Save
                    </button>
                  </div>
                  {formErrors.profileName && (
                    <p className="text-red-500 text-xs">{formErrors.profileName}</p>
                  )}
                </div>
              ) : (
                <div className="flex justify-center items-center gap-4">
                  <h2 className="text-2xl font-bold text-gray-800">{profileName}</h2>
                  <button
                    onClick={() => startEditing("profileName", profileName)}
                    className="text-sm text-blue-500 border px-3 py-1 rounded hover:text-blue-700"
                  >
                    Edit
                  </button>
                </div>
              )}

              {/* Bio */}
              <div className="mt-4">
                {editingField === "profileBio" ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex gap-3 justify-center">
                      <textarea
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className={`border px-4 py-3 rounded w-full max-w-2xl ${formErrors.profileBio ? 'border-red-500' : ''}`}
                        rows={3}
                        autoFocus
                      />
                      <button
                        onClick={handleSave}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                    </div>
                    {formErrors.profileBio && (
                      <p className="text-red-500 text-xs">{formErrors.profileBio}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <div className="bg-gray-50 border rounded-xl shadow-inner p-4 w-full max-w-2xl">
                      <p className="text-gray-700">{profileBio}</p>
                    </div>
                    <button
                      onClick={() => startEditing("profileBio", profileBio)}
                      className="ml-4 text-sm text-blue-500 border px-3 py-1 rounded hover:text-blue-700"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Event Types */}
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Event Types</h3>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add new..."
                      value={newEventType}
                      onChange={(e) => {
                        setNewEventType(e.target.value);
                        if (formErrors.newEventType) {
                          setFormErrors((prev) => ({ ...prev, newEventType: "" }));
                        }
                      }}
                      onKeyDown={(e) => e.key === "Enter" && addEventType()}
                      className={`border rounded px-3 py-1 text-sm ${formErrors.newEventType ? 'border-red-500' : ''}`}
                    />
                    <button
                      onClick={addEventType}
                      className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setEditMode(!editMode)}
                      className={`px-3 py-1 text-sm rounded border transition ${editMode ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700'}`}
                    >
                      {editMode ? 'Done' : 'Edit'}
                    </button>
                  </div>
                  {formErrors.newEventType && (
                    <p className="text-red-500 text-xs">{formErrors.newEventType}</p>
                  )}
                </div>
              </div>

              {/* Event Types List */}
              <div className="flex flex-wrap gap-2 mt-3">
                {eventTypes.length ? (
                  eventTypes.map((type, idx) => (
                    <div
                      key={idx}
                      className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 flex items-center shadow-inner"
                    >
                      <span className="text-blue-700 text-sm">{type}</span>
                      {editMode && (
                        <button
                          onClick={() => removeEventType(idx)}
                          className="ml-2 text-red-500 hover:text-red-700 text-xs w-5 h-5 flex items-center justify-center rounded-full border border-red-200 bg-white"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No event types added yet.</p>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* My Events Section */}
        <div className="mt-12 max-w-6xl mx-auto">
          <hr />
          <h2 className="text-2xl font-bold text-center mb-6">OUR EVENTS</h2>
          <button className="bg-gray-300 p-3 rounded-2xl mb-3" onClick={handleFormClick}>
            Add Post
          </button>

          <div className="space-y-6">
            {events.length === 0 ? (
              <p className="text-center text-gray-500">No events created yet.</p>
            ) : (
              events.map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-2xl shadow-inner p-4 flex gap-6 hover:shadow-md transition cursor-pointer items-center"
                  onClick={() => handleBoxClick(event._id)}
                >
                  {/* Main Image */}
                  <div className="w-70 h-32 flex-shrink-0">
                    <img
                      src={event.mainImage}
                      alt={event.eventName}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">{event.eventName}</h3>
                    {event.date && event.time && (
                      <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
                    )}
                    {event.location && (
                      <p className="text-gray-700 mt-1">{event.location}</p>
                    )}
                    {event.description && (
                      <p className="text-gray-600 mt-2 text-sm line-clamp-2">{event.description}</p>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="text-sm text-gray-600 text-right space-y-1 min-w-[150px]">
                    {event.eventType && (
                      <div>
                        <span className="font-medium text-blue-600">Type:</span> {event.eventType}
                      </div>
                    )}
                    {event.totalTicketsSold > 0 && (
                      <div>Tickets Sold: {event.totalTicketsSold}</div>
                    )}
                    {event.totalRevenue > 0 && (
                      <div>Revenue: ₹{event.totalRevenue}</div>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );

};

export default HeroSection;