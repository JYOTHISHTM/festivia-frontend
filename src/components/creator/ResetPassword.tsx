import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../../config/config";
import { API_CONFIG } from "../../config/config";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .matches(/^\S.*$/, "Password cannot start with a space")
        .min(6, "Password must be at least 6 characters")
        .matches(/[A-Z]/, "Must contain at least one uppercase letter")
        .matches(/\d/, "Must contain at least one number")
        .matches(/[@$!%*?&]/, "Must contain at least one special character (@$!%*?&)")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), undefined], "Passwords must match")
        .required("Confirm Password is required"),
    }),

    onSubmit: async (values) => {
      try {
        const response = await fetch(`${BASE_URL}/${API_CONFIG.CREATOR.ENDPOINTS.RESEST_PASSWORD}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password: values.password,
            type: "creator",
          }),
        });

        const data = await response.json();
        if (response.ok) {
          console.log("✅ Password updated successfully");
          navigate("/creator/login");
        } else {
          Toastify({
            text: data.message || "Failed to reset password",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "#ff4d4d",
            stopOnFocus: true
          }).showToast();
        }

      } catch (error) {
        console.error("❌ Error:", error);
        Toastify({
          text: "Something went wrong.",
          duration: 3000,
          close: true,
          gravity: "top",    
          position: "right",    
          backgroundColor: "#ff4d4d",
          stopOnFocus: true
        }).showToast();
      }

    },
  });



  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Reset Password</h2>

        {/* Password */}
        <div className="relative">
          <label className="block font-medium mb-1">New Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border px-3 py-2 rounded"
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-9 cursor-pointer text-sm text-gray-500"
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="block font-medium mb-1">Confirm Password</label>
          <input
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border px-3 py-2 rounded"
          />
          <span
            onClick={() => setShowConfirm((prev) => !prev)}
            className="absolute right-3 top-9 cursor-pointer text-sm text-gray-500"
          >
            {showConfirm ? "🙈" : "👁️"}
          </span>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
