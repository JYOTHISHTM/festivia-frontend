import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import SideBar from '../layout/creator/SideBar';
import { createEventForm } from '../../services/creator/creatorService';
import LocationAutocomplete from './LocationAutocomplete';
import { creatorService } from '../../services/creator/creatorService';


interface FormValues {
  eventName: string;
  eventType: string;
  description: string;
  daySelectionMode: 'single' | 'range';
  date: string;
  startDate: string;
  endDate: string;
  time: string;
  location: string;
  totalSeats: string;
  seatType: string;
  price: string;
  creatorId?: string;
  seatLayoutSelected: string
  layoutId?: string;
  geoLocation: {
    type: 'Point';
    coordinates: [number, number];
  };

}

const CreateEvent: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [seatLayoutSelected, setSeatLayoutSelected] = useState(false);
  const [layoutId, setLayoutId] = useState<string | null>(null);
  const creator = JSON.parse(localStorage.getItem("creator") || '{}');
  const creatorId = creator.id || null;
  const token = localStorage.getItem("accessToken"); 
  // const token = localStorage.getItem("creatorToken"); 

  useEffect(() => {
    const creator = JSON.parse(localStorage.getItem("creator") || '{}');
    const creatorId = creator.id||creator._id;

    if (!creatorId) {
      console.log("No creatorId found, skipping fetch");
      return;
    }



   const checkLayoutSelected = async () => {
  try {
    const layoutArray = await creatorService.checkLayoutSelected(creatorId);

    if (Array.isArray(layoutArray) && layoutArray.length > 0) {
      setSeatLayoutSelected(true);
      setLayoutId(layoutArray[0]._id);
    } else {
      setSeatLayoutSelected(false);
    }
  } catch (err) {
    console.error("Error checking layout:", err);
    setSeatLayoutSelected(false);
  }
};


    checkLayoutSelected();
  }, []);


  const handleSelectSeatLayout = () => {
    navigate(`/creator/seat-layout`);
    setSeatLayoutSelected(true);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const initialValues: FormValues = {
    eventName: '',
    eventType: '',
    description: '',
    seatLayoutSelected: '',
    daySelectionMode: 'single',
    date: '',
    startDate: '',
    endDate: '',
    time: '',
    location: '',
    totalSeats: '',
    seatType: '',
    price: '',
    layoutId: layoutId || '',
    geoLocation: {
      type: 'Point',
      coordinates: [0, 0],
    }

  };

  const validationSchema = Yup.object({
    eventName: Yup.string()
      .required('Event name is required')
      .test(
        'no-leading-space',
        'Event name cannot start with a space',
        (value) => value?.charAt(0) !== ' '
      )
      .min(3, 'Event name must be at least 3 characters')
    ,


    eventType: Yup.string()
      .required('Event type is required')
      .matches(/^[A-Za-z,\s]+$/, 'Only letters, commas, and spaces are allowed')
      .test('no-leading-trailing-space', 'Cannot start with space', value => {
        if (!value) return true;
        return value === value.trim();
      }),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters')
      .test('no-leading-trailing-space', 'Cannot start with spaces', value => {
        if (!value) return true;
        return value === value.trim();
      }),



    daySelectionMode: Yup.string().required('Required'),

    date: Yup.string().when('daySelectionMode', {
      is: (mode: string) => mode === 'single',
      then: () =>
        Yup.string()
          .required('Date is required')
          .test('is-after-today', 'Date must be after today', function (value) {
            return value ? new Date(value) > today : false;
          }),
      otherwise: () => Yup.string().notRequired()
    }),

    startDate: Yup.string().when('daySelectionMode', {
      is: (mode: string) => mode === 'range',
      then: () =>
        Yup.string()
          .required('Start Date is required')
          .test('start-after-today', 'Start date must be after today', function (value) {
            return value ? new Date(value) > today : false;
          }),
      otherwise: () => Yup.string().notRequired()
    }),

    endDate: Yup.string().when(['daySelectionMode', 'startDate'], {
      is: (mode: string) => mode === 'range',
      then: () =>
        Yup.string()
          .required('End Date is required')
          .test('end-after-start', 'End date must be after start date', function (end) {
            const { startDate } = this.parent;
            return end && startDate ? new Date(end) > new Date(startDate) : false;
          }),
      otherwise: () => Yup.string().notRequired()
    }),

    location: Yup.string()
      .required('Location is required')
      .min(3, 'Location must be at least 3 characters')
      .test('no-leading-trailing-space', 'Cannot start  with spaces', value => {
        if (!value) return true;
        return value === value.trim();
      }),
    seatType: Yup.string()
      .required('Please select a seat type')
      .oneOf(['GENERAL', 'RESERVED'], 'Invalid seat type'),


    price: Yup.number()
  .typeError('Price must be a number')
  .when('seatType', {
    is: 'GENERAL',
    then: (schema) =>
      schema
        .required('Price is required')
        .min(0, 'Price cannot be negative')
        .max(10000, 'Price cannot be greater than 10000'),
    otherwise: (schema) => schema.notRequired(),
  }),




  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (!file.type.startsWith('image/')) {
        setImageError('Please upload a valid image file');
        setImage(null);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setImageError('Image should be less than 5MB');
        setImage(null);
        return;
      }

      setImageError(null);
      setImage(file);
    }
  };

  useEffect(() => {
  }, [layoutId]);

  const handleSubmit = async (
    values: FormValues,

    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    try {
      if (!image) {
        setImageError('Please upload an image');
        setSubmitting(false);
        return;
      }

      if (values.seatType === 'RESERVED' && !layoutId) {
        console.log("No seat layout selected");
        setSubmitting(false);
        return;
      }

      const form = new FormData();


      Object.entries(values).forEach(([key, value]) => {
        if (values.seatType === 'GENERAL' &&
          (key === 'totalSeats' || key === 'earlyBirdTickets' || key === 'earlyBirdDiscount' || key === 'layoutId')) {
          return;
        }
        if (values.seatType === 'RESERVED' &&
          (key === 'earlyBirdTickets' || key === 'earlyBirdDiscount' || key === 'totalSeats' || key === 'price')) {
          return;
        }

        if (key === 'geoLocation') {
          form.append('geoLocation', JSON.stringify(value));
        } else {
          form.append(key, value as string); 
        }
      });


      if (values.layoutId) {
        form.append('layoutId', values.layoutId);
      } else if (layoutId) {
        form.append('layoutId', layoutId);
      }


      form.append('image', image);
      console.log("creator id in frontEnd 2", creatorId);

      if (creatorId) {
        form.append('creatorId', creatorId);
      }
      console.log("creator id in frontEnd 1", creatorId);

      for (let pair of form.entries()) {
        console.log(pair[0], pair[1]);
      }

        const response = await createEventForm(form,token);
      
            if (!response.success) {
              throw new Error(response.error);
            }

      if (response.data && response.data._id) {
        navigate(`/creator/event/${response.data._id}`);
      }
    } catch (error) {
      console.error('❌ Failed to create event:', error);
      setServerError('Failed to create event. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };




  return (
    <div className="flex min-h-screen">
      <SideBar />
      <div className="flex-1 p-8 bg-gray-100 flex justify-center">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, touched, errors }) => (

            <Form className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl space-y-6">
              <h1 className="text-3xl font-bold text-center mb-6">Create Event</h1>

              {serverError && (
                <div className="text-red-500 bg-red-50 p-3 rounded">{serverError}</div>
              )}

              {/* Event Name */}
              <div className="space-y-1">
                <Field
                  type="text"
                  name="eventName"
                  placeholder="Enter Your Event Name"
                  className={`w-full p-3 border rounded ${touched.eventName && errors.eventName ? 'border-red-500' : ''
                    }`}
                />
                <ErrorMessage name="eventName" component="p" className="text-red-500 text-sm" />
              </div>

              {/* Event Type */}
              <div className="space-y-1">
                <Field
                  type="text"
                  name="eventType"
                  placeholder="Enter Your Event Type [MUSIC, CONCERT, SEMINAR, DRAMA...]"
                  className={`w-full p-3 border rounded ${touched.eventType && errors.eventType ? 'border-red-500' : ''
                    }`}
                />
                <ErrorMessage name="eventType" component="p" className="text-red-500 text-sm" />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <Field
                  as="textarea"
                  name="description"
                  placeholder="Enter Your Description"
                  className={`w-full p-3 border rounded ${touched.description && errors.description ? 'border-red-500' : ''
                    }`}
                />
                <ErrorMessage name="description" component="p" className="text-red-500 text-sm" />
              </div>




              {/* Day selection mode */}
              <div className="space-y-1">
                <label className="block font-medium">Day Type</label>
                <Field as="select" name="daySelectionMode" className="w-full p-3 border rounded">
                  <option value="single">Single Day</option>
                  <option value="range">Multiple Days</option>
                </Field>
              </div>

              {/* Conditional fields */}
              {values.daySelectionMode === 'single' ? (
                <div className="space-y-1">
                  <Field
                    type="date"
                    name="date"
                    className={`w-full p-3 border rounded ${touched.date && errors.date ? 'border-red-500' : ''}`}
                  />
                  <ErrorMessage name="date" component="p" className="text-red-500 text-sm" />
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="block font-medium">Start Date</label>
                    <Field
                      type="date"
                      name="startDate"
                      className={`w-full p-3 border rounded ${touched.startDate && errors.startDate ? 'border-red-500' : ''}`}
                    />
                    <ErrorMessage name="startDate" component="p" className="text-red-500 text-sm" />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-medium">End Date</label>
                    <Field
                      type="date"
                      name="endDate"
                      className={`w-full p-3 border rounded ${touched.endDate && errors.endDate ? 'border-red-500' : ''}`}
                    />
                    <ErrorMessage name="endDate" component="p" className="text-red-500 text-sm" />
                  </div>
                </>
              )}





              {/* Time */}
              <div className="space-y-1">
                <Field
                  as="select"
                  name="time"
                  className={`w-full p-3 border rounded ${touched.time && errors.time ? 'border-red-500' : ''
                    }`}
                >
                  <option value="">Select Time</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) =>
                    ["00", "30"].map((minutes) => (
                      <>
                        <option key={`${hour}:${minutes} AM`} value={`${hour}:${minutes} AM`}>
                          {hour}:{minutes} AM
                        </option>
                        <option key={`${hour}:${minutes} PM`} value={`${hour}:${minutes} PM`}>
                          {hour}:{minutes} PM
                        </option>
                      </>
                    ))
                  )}
                </Field>
                <ErrorMessage name="time" component="p" className="text-red-500 text-sm" />
              </div>



              <div className="space-y-1">
                <Field name="location" component={LocationAutocomplete} />
                <ErrorMessage name="location" component="p" className="text-red-500 text-sm" />
              </div>





              {values.seatType === "RESERVED" && seatLayoutSelected ? (
                <div className="my-4">
                  <button
                    type="button"
                    disabled
                    className="px-4 py-2 rounded bg-green-600 text-white cursor-not-allowed"
                  >
                    Selected
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <Field
                    as="select"
                    name="seatType"
                    className={`w-full p-3 border rounded ${touched.seatType && errors.seatType ? "border-red-500" : ""
                      }`}
                  >
                    <option value="" disabled>
                      Choose Seat Type
                    </option>
                    <option value="GENERAL">GENERAL</option>
                    <option value="RESERVED">RESERVED</option>
                  </Field>
                  <ErrorMessage
                    name="seatType"
                    component="p"
                    className="text-red-500 text-sm"
                  />

                  {/* Show price only for GENERAL */}
                  {values.seatType === "GENERAL" && (
                    <div className="space-y-1">
                      <Field
                        type="number"
                        name="price"
                        placeholder="Enter Your Ticket Price"
                        className={`w-full p-3 border rounded ${touched.price && errors.price ? "border-red-500" : ""
                          }`}
                      />
                      <ErrorMessage
                        name="price"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  )}

                  {values.seatType === "RESERVED" && !seatLayoutSelected && (
                    <div className="my-4">
                      <button
                        type="button"
                        onClick={handleSelectSeatLayout}
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                      >
                        Select Seat Layout
                      </button>
                    </div>
                  )}
                </div>
              )}





              {/* Image Upload */}
              <div className="space-y-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={`w-full p-3 border rounded ${imageError ? 'border-red-500' : ''}`}
                  required
                />
                {imageError && <p className="text-red-500 text-sm">{imageError}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-black text-white py-3 px-4 rounded hover:bg-gray-800 w-full font-medium transition duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
              >
                {isSubmitting ? 'Creating Event...' : 'Create Event'}
              </button>
            </Form>

          )}
        </Formik>
      </div>
    </div>
  );
};


export default CreateEvent;