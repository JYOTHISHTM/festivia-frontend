import { useState, useEffect } from "react";
import { Edit2, Save, X, User2, Mail, Briefcase, MapPin } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import Navbar from "../layout/user/HomeNavbar";
import Sidebar from "../layout/user/SideBar";
// import api from '../../services/ApiService';



import { createApiInstance } from "../../utils/authApi";
const api = createApiInstance("user");


interface User {
  id: string;
  name: string;
  email: string;
  age: string;
  occupation: string;
  phoneNumber: string;
  address: string;
  gender: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<User>({
    id: "", name: "", email: "", age: "", gender: "", address: "", phoneNumber: "", occupation: ""
  });
  const [errors, setErrors] = useState<Partial<Record<keyof User, string>>>({});

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("accessToken");
      // const token = localStorage.getItem("userToken");
      if (!token) {
        toast.error("Unauthorized. Please log in.");
        return;
      }

      try {
        const res = await api.get("/users/profile-data", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
          setUser(res.data);
          setUpdatedUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const validate = () => {
    const newErrors: Partial<Record<keyof User, string>> = {};


    if (!updatedUser.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]{2,50}$/.test(updatedUser.name)) {
      newErrors.name = "Name must only contain letters and spaces (2–50 chars)";
    }


    if (!updatedUser.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[a-z][\w.-]*@[a-z0-9.-]+\.[a-z]{2,}$/.test(updatedUser.email)) {
      newErrors.email = "Email must be in lowercase and properly formatted";
    }


    if (updatedUser.age && (parseInt(updatedUser.age) <= 0 || isNaN(parseInt(updatedUser.age)))) {
      newErrors.age = "Enter a valid age";
    }

   
    if (
      updatedUser.phoneNumber &&
      (!/^\d{10}$/.test(updatedUser.phoneNumber) || /^0+$/.test(updatedUser.phoneNumber))
    ) {
      newErrors.phoneNumber = "Phone number must be 10 digits and cannot be all zeros";
    }


    if (updatedUser.gender && !["Male", "Female"].includes(updatedUser.gender)) {
      newErrors.gender = "Select a valid gender";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) {
      toast.error("Please fix validation errors");
      return;
    }

    if (
      updatedUser.name === user?.name &&
      updatedUser.email === user?.email &&
      updatedUser.age === user?.age &&
      updatedUser.address === user.address &&
      updatedUser.gender === user.gender &&
      updatedUser.occupation === user.occupation &&
      updatedUser.phoneNumber === user.phoneNumber
    ) {
      toast.error("No changes detected");
      setEditMode(false);
      return;
    }

    try {
      const res = await api.put("/users/update-profile", updatedUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        // headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });

      if (res.status === 200) {
        setUser(res.data);
        setUpdatedUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        setEditMode(false);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    if (user) {
      setUpdatedUser(user);
    }
    setEditMode(false);
    toast.error("Changes cancelled");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-4xl font-medium text-gray-500">Loading...</div>
      </div>
    );
  }

  const inputClass = (error?: string) =>
    `w-full px-4 py-2 rounded-lg border ${error ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`;

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gradient-to-b from-green-100/100 to-transparent">
        <div className="fixed top-[32px] left-10 z-20">
          <Sidebar />
        </div>
        <div className="flex-1 ml-[60px] w-full">
          <Toaster position="top-right" />
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden mt-20">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-2xl font-semibold text-gray-900">Profile Settings</h1>
                  {!editMode ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Edit2 size={16} />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdate}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        <Save size={16} />
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <User2 size={16} className="text-gray-400" />
                      Name
                    </label>
                    {editMode ? (
                      <>
                        <input
                          type="text"
                          value={updatedUser.name}
                          onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
                          className={inputClass(errors.name)}
                          placeholder="Enter your name"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                      </>
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-700">{user.name}</div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Mail size={16} className="text-gray-400" />
                      Email
                    </label>
                    {editMode ? (
                      <>
                        <input
                          type="email"
                          value={updatedUser.email}
                          onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
                          className={inputClass(errors.email)}
                          placeholder="Enter your email"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </>
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-700">{user.email}</div>
                    )}
                  </div>

                  {/* Conditional Fields */}
                  {(editMode || user.age || user.gender || user.occupation || user.address || user.phoneNumber) && (
                    <>
                      {/* Age */}
                      {(editMode || user.age) && (
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <span className="text-gray-400">🎂</span> Age
                          </label>
                          {editMode ? (
                            <>
                              <input
                                type="number"
                                value={updatedUser.age}
                                onChange={(e) => setUpdatedUser({ ...updatedUser, age: e.target.value })}
                                className={inputClass(errors.age)}
                                placeholder="Enter your age"
                              />
                              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                            </>
                          ) : (
                            <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-700">{user.age}</div>
                          )}
                        </div>
                      )}

                      {/* Gender */}
                      {(editMode || user.gender) && (
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <span className="text-gray-400">⚧</span> Gender
                          </label>
                          {editMode ? (
                            <>
                              <select
                                value={updatedUser.gender}
                                onChange={(e) => setUpdatedUser({ ...updatedUser, gender: e.target.value })}
                                className={inputClass(errors.gender)}
                              >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                              </select>
                              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                            </>
                          ) : (
                            <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-700">{user.gender}</div>
                          )}
                        </div>
                      )}

                      {/* Occupation */}
                      {(editMode || user.occupation) && (
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Briefcase size={16} className="text-gray-400" /> Occupation
                          </label>
                          {editMode ? (
                            <input
                              type="text"
                              value={updatedUser.occupation}
                              onChange={(e) => setUpdatedUser({ ...updatedUser, occupation: e.target.value })}
                              className={inputClass()}
                              placeholder="Enter your occupation"
                            />
                          ) : (
                            <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-700">{user.occupation}</div>
                          )}
                        </div>
                      )}

                      {/* Address */}
                      {(editMode || user.address) && (
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <MapPin size={16} className="text-gray-400" /> Address
                          </label>
                          {editMode ? (
                            <input
                              type="text"
                              value={updatedUser.address}
                              onChange={(e) => setUpdatedUser({ ...updatedUser, address: e.target.value })}
                              className={inputClass()}
                              placeholder="Enter your address"
                            />
                          ) : (
                            <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-700">{user.address}</div>
                          )}
                        </div>
                      )}

                      {/* Phone Number */}
                      {(editMode || user.phoneNumber) && (
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <span className="text-gray-400">📞</span> Phone Number
                          </label>
                          {editMode ? (
                            <>
                              <input
                                type="tel"
                                value={updatedUser.phoneNumber}
                                onChange={(e) => setUpdatedUser({ ...updatedUser, phoneNumber: e.target.value })}
                                className={inputClass(errors.phoneNumber)}
                                placeholder="Enter your phone number"
                              />
                              {errors.phoneNumber && (
                                <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                              )}
                            </>
                          ) : (
                            <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-700">{user.phoneNumber}</div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
