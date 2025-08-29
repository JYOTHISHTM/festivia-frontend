
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BASE_URL } from "../../config/config";
import { API_CONFIG } from "../../config/config";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";



const SignUpForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role:"user"
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .matches(/^\S.*$/, "Name cannot start with a space") 
        .min(3, "Name must be at least 3 characters")
        .required("Name is required"),
        
      email: Yup.string()
        .matches(/^\S.*$/, "Email cannot start with a space")   
        .email("Invalid email address")
        .required("Email is required"),
        
        password: Yup.string()
        .matches(/^\S.*$/, "Password cannot start with a space") 
        .min(6, "Password must be at least 6 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter") 
        .matches(/\d/, "Password must contain at least one number") 
        .matches(/[@$!%*?&]/, "Password must contain at least one special character (@$!%*?&)") 
        .required("Password is required"),
      
    }),
  
    onSubmit: async (values) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/${API_CONFIG.USER_ENDPOINTS.REGISTER}`, 
      values,
      { withCredentials: true } 
    );

    if (response.data.success) {
      sessionStorage.setItem("email", values.email);
      navigate("/user/verify-otp");
    }
  } catch (err: any) {
    setError(err.response?.data?.message || "Something went wrong");
  }
}

  });
  

  return (
    <div className="flex justify-center items-center min-h-screen p-6  bg-gradient-to-b from-green-100/100 to-transparent ">
      <div className="form-card flex w-[900px] h-[550px] bg-white rounded-[30px] shadow-2xl shadow-gray-600/100 overflow-hidden">
        <div className="image-container w-3/5 h-[600px] bg-[#f9fafb] flex justify-center items-center p-8 relative overflow-hidden ">
          <img
            className="w-full h-auto max-h-[380px] rounded-[20px] transition-transform duration-300 transform hover:scale-105"
            src="https://res.cloudinary.com/drha2z2qr/image/upload/v1741850318/27637692_7347889_kt6mtf.jpg"
            alt="Profile"
          />
        </div>
        <div className="form-content w-3/5 p-10 bg-white">
          <div className="header text-center mb-6">
            <h1 className="text-3xl font-bold text-[#1a1a1a]">USER SIGN-UP</h1>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="name"
                className="text-[#4b5563] text-base font-medium mb-2 block"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                {...formik.getFieldProps("name")}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-gray-500"
              />
              {formik.touched.name && formik.errors.name ? (
                <p className="text-red-500 text-sm">{formik.errors.name}</p>
              ) : null}
            </div>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="text-[#4b5563] text-base font-medium mb-2 block"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                {...formik.getFieldProps("email")}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-gray-500"
              />
              {formik.touched.email && formik.errors.email ? (
                <p className="text-red-500 text-sm">{formik.errors.email}</p>
              ) : null}
            </div>
            <div className="mb-6 relative">
              <label
                htmlFor="password"
                className="text-[#4b5563] text-base font-medium mb-2 block"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                {...formik.getFieldProps("password")}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-gray-500"
              />
              <button
                type="button"
                className="absolute top-12 right-4"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {formik.touched.password && formik.errors.password ? (
                <p className="text-red-500 text-sm">{formik.errors.password}</p>
              ) : null}
            </div>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-green-600"
            >
              Create an Account
            </button>
          </form>
          <div className="text-center mt-6">
            <a href="/user/login" className="text-gray-500 text-sm hover:underline">
              Already have an account? Log In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
