// src/pages/SignUpForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { creatorService } from '../../services/creator/creatorService';

const SignUpForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateName = (value: string) => {
    if (value.startsWith(" ")) return "Name cannot start with a space";
    if (value.length < 3) return "Name must be at least 3 characters";
    if (!/^[A-Za-z\s]+$/.test(value)) return "Name can only contain letters";
    return "";
  };

  const validateEmail = (value: string) => {
    if (value.startsWith(" ")) return "Email cannot start with a space";
    if (!value.includes("@")) return "Email must contain '@'";
    if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(value)) return "Invalid email format";
    return "";
  };

  const validatePassword = (value: string) => {
    if (value.startsWith(" ")) return "Password cannot start with a space";
    if (value.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
    if (!/[0-9]/.test(value)) return "Password must contain at least one number";
    if (!/[@$!%*?&]/.test(value)) return "Password must contain at least one special character (@$!%*?&)";
    return "";
  };

  const handleSubmit = async (values: any, { setSubmitting, setStatus }: any) => {
    const result = await creatorService.signUp(values);
    
    if (result.success) {
      sessionStorage.setItem("email", values.email);
      navigate("/creator/verify-otp");
    } else {
      setStatus(result.error);
    }
    
    setSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <div className="form-card flex w-[1050px] h-[600px] bg-white rounded-[30px] shadow-2xl shadow-gray-600/100 overflow-hidden">
        <div className="image-container w-4/5 h-[600px] bg-[#f9fafb] flex justify-center items-center p-8 relative overflow-hidden">
          <img className="w-full h-auto max-h-[380px] rounded-[20px] transition-transform duration-300 transform hover:scale-105"
            src="https://res.cloudinary.com/drha2z2qr/image/upload/v1741850318/27637692_7347889_kt6mtf.jpg" alt="Profile"
          />
        </div>
        <div className="form-content w-3/5 p-10 bg-white">
          <div className="header text-center mb-6">
            <h1 className="text-3xl font-bold text-[#1a1a1a]">CREATOR SIGN-UP</h1>
          </div>

          <Formik
            initialValues={{ name: '', email: '', password: '' }}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, status }) => (
              <Form>
                <div className="mb-6">
                  <label htmlFor="name" className="text-[#4b5563] text-base font-medium mb-2 block">Name</label>
                  <Field type="text" id="name" name="name" validate={validateName}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-gray-500"
                  />
                  <ErrorMessage name="name" component="p" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="text-[#4b5563] text-base font-medium mb-2 block">Email</label>
                  <Field type="email" id="email" name="email" validate={validateEmail}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-gray-500"
                  />
                  <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="mb-6 relative">
                  <label htmlFor="password" className="text-[#4b5563] text-base font-medium mb-2 block">Password</label>
                  <Field type={showPassword ? "text" : "password"} id="password" name="password" validate={validatePassword}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-gray-500"
                  />
                  <button type="button" className="absolute top-12 right-4" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <ErrorMessage name="password" component="p" className="text-red-500 text-sm mt-1" />
                </div>

                {status && <p className="text-red-500 text-sm mb-3">{status}</p>}

                <button type="submit" disabled={isSubmitting}
                  className="w-full bg-black text-white py-3 rounded-lg hover:bg-green-600">
                  {isSubmitting ? "Creating Account..." : "Create an Account"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="text-center mt-6">
            <a href="/creator/login" className="text-gray-500 text-sm hover:underline">
              Already have an account? Log In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;