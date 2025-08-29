import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router";
import SidebarNavigation from "../layout/creator/SideBar";
import { createEvent } from '../../services/creator/creatorService';

interface FormState {
  eventName: string;
  date: string;
  eventType: string;
  category: "Public" | "Private" | "";
  subCategory: "Reserved" | "General" | "";
  totalTicketsSold: string;
  totalRevenue: string;
}

interface FormErrors {
  [key: string]: string | undefined;
  mainImage?: string;
}

interface ToastProps {
  message: string;
  type: "success" | "error";
  show: boolean;
}

const EventForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    eventName: "",
    date: "",
    eventType: "",
    category: "",
    subCategory: "",
    totalTicketsSold: "",
    totalRevenue: "",
  });

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastProps>({
    message: "",
    type: "success",
    show: false,
  });

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category" && value === "Private"
        ? { subCategory: "", totalTicketsSold: "", totalRevenue: "" }
        : {}),
      ...(name === "subCategory" && value === "General"
        ? { totalTicketsSold: "" }
        : {}),
    }));
  };

  const validate = () => {
    const newErrors: FormErrors = {};

    if (!form.eventType) newErrors.eventType = "Event type is required.";
    if (!form.date) newErrors.date = "Date is required.";
    if (!form.category) newErrors.category = "Event category is required.";
    if (form.category === "Public" && !form.subCategory)
      newErrors.subCategory = "Subcategory is required.";

    if (form.subCategory === "Reserved" && form.totalTicketsSold && isNaN(+form.totalTicketsSold)) {
      newErrors.totalTicketsSold = "Must be a number.";
    }

    if (
      ["Reserved", "General"].includes(form.subCategory) &&
      form.totalRevenue &&
      isNaN(+form.totalRevenue)
    ) {
      newErrors.totalRevenue = "Must be a number.";
    }

    if (!mainImage) {
      newErrors.mainImage = "Main image is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdditionalImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 4) {
      setToast({
        message: "You can only upload up to 4 additional images.",
        type: "error",
        show: true,
      });
      return;
    }
    setAdditionalImages(files);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const formData = new FormData();

    const payload = {
      ...form,
      eventName: form.eventName || form.eventType,
    };

    Object.entries(payload).forEach(([key, value]) => formData.append(key, value));

    if (mainImage) formData.append("mainImage", mainImage);
    additionalImages.forEach((file) => formData.append("additionalImages", file));

    const creatorString = localStorage.getItem("creator");
    const creator = creatorString ? JSON.parse(creatorString) : null;

    if (creator?.id) {
      formData.append("creator", creator.id);
    }

    try {
      const result = await createEvent(formData);

      if (!result.success) {
        throw new Error(result.error);
      }
      setToast({
        message: "Event created successfully!",
        type: "success",
        show: true,
      });

      setForm({
        eventName: "",
        date: "",
        eventType: "",
        category: "",
        subCategory: "",
        totalTicketsSold: "",
        totalRevenue: "",
      });

      setMainImage(null);
      setAdditionalImages([]);

      setTimeout(() => {
        navigate("/creator/event-profile");
      }, 1500);
    } catch (err) {
      setToast({
        message: "Event creation failed. Please try again.",
        type: "error",
        show: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };




  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarNavigation />

      {/* Toast message */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-y-0 opacity-100
            ${toast.type === "success" ? "bg-green-500" : "bg-red-500"} text-white`}
        >
          <div className="flex items-center space-x-2">
            {toast.type === "success" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="flex-1 p-6 flex justify-center">
        {isSubmitting && (
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-md flex items-center justify-center">
            <div className="w-80 h-60 bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center justify-center">
              {/* Spinner */}
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

              {/* Loading Text */}
              <p className="mt-6 text-lg font-medium text-gray-800">Creating your event...</p>
            </div>
          </div>

        )}

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="w-full max-w-4xl p-8 shadow-lg rounded-xl bg-white mt-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create New Event</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Type */}
            <div>
              <label className="block font-semibold mb-2 text-gray-700">Event Type</label>
              <input
                name="eventType"
                value={form.eventType}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
                placeholder="Enter event type"
              />
              {errors.eventType && <p className="text-red-500 text-sm mt-1">{errors.eventType}</p>}
            </div>

            {/* Event Name */}
            <div>
              <label className="block font-semibold mb-2 text-gray-700">Event Name (optional)</label>
              <input
                name="eventName"
                value={form.eventName}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
                placeholder="Enter event name"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block font-semibold mb-2 text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block font-semibold mb-2 text-gray-700">Event Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
              >
                <option value="">Select Category</option>
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            {/* Subcategory */}
            {form.category === "Public" && (
              <div>
                <label className="block font-semibold mb-2 text-gray-700">Public Subcategory</label>
                <select
                  name="subCategory"
                  value={form.subCategory}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
                >
                  <option value="">Select Subcategory</option>
                  <option value="Reserved">Reserved</option>
                  <option value="General">General</option>
                </select>
                {errors.subCategory && <p className="text-red-500 text-sm mt-1">{errors.subCategory}</p>}
              </div>
            )}

            {/* Reserved Fields */}
            {form.subCategory === "Reserved" && (
              <>
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Total Tickets Sold (optional)</label>
                  <input
                    type="number"
                    name="totalTicketsSold"
                    value={form.totalTicketsSold}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    placeholder="Enter number of tickets"
                  />
                  {errors.totalTicketsSold && <p className="text-red-500 text-sm mt-1">{errors.totalTicketsSold}</p>}
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Total Revenue (optional)</label>
                  <input
                    type="number"
                    name="totalRevenue"
                    value={form.totalRevenue}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    placeholder="Enter revenue amount"
                  />
                  {errors.totalRevenue && <p className="text-red-500 text-sm mt-1">{errors.totalRevenue}</p>}
                </div>
              </>
            )}

            {/* General Revenue */}
            {form.subCategory === "General" && (
              <div>
                <label className="block font-semibold mb-2 text-gray-700">Total Revenue (optional)</label>
                <input
                  type="number"
                  name="totalRevenue"
                  value={form.totalRevenue}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
                  placeholder="Enter revenue amount"
                />
                {errors.totalRevenue && <p className="text-red-500 text-sm mt-1">{errors.totalRevenue}</p>}
              </div>
            )}
          </div>

          {/* Image Uploads */}
          <div className="mt-8">
            <label className="block font-semibold mb-2 text-gray-700">Main Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setMainImage(e.target.files?.[0] || null)}
              className="w-full border p-2 rounded-lg"
            />
            {mainImage && (
              <div className="mt-3">
                <img
                  src={URL.createObjectURL(mainImage)}
                  alt="Main Preview"
                  className="h-40 object-cover rounded-xl"
                />
              </div>
            )}
            {errors.mainImage && <p className="text-red-500 text-sm mt-1">{errors.mainImage}</p>}
          </div>

          <div className="mt-6">
            <label className="block font-semibold mb-2 text-gray-700">Additional Images (max 4)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleAdditionalImagesChange}
              className="w-full border p-2 rounded-lg"
            />
            {additionalImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                {additionalImages.map((file, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Additional ${i}`}
                      className="h-24 w-full object-cover rounded-md"
                    />
                    <p className="text-xs mt-1 truncate w-full text-center">{file.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-8 w-full p-4 rounded-xl text-white text-lg font-semibold 
              ${isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700 transform transition hover:scale-[1.02]"}`}
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventForm;