import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config/config";
import { API_CONFIG } from "../../config/config";
import Swal from "sweetalert2";

interface FormValues {
  email: string;
}

function ForgotOtp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const [emailSubmitted, setEmailSubmitted] = useState<boolean>(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const navigate = useNavigate();
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [emailValue, setEmailValue] = useState<string>("");

const onEmailSubmit: SubmitHandler<FormValues> = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}/${API_CONFIG.USER_ENDPOINTS.SEND_OTP}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: data.email, type: "user" }),
    });

    const resData = await response.json();

    if (response.ok) {
      console.log("✅ OTP sent to:", data.email);
      setEmailSubmitted(true);
      setEmailValue(data.email);
      Swal.fire("Success", "OTP sent successfully!", "success");
    } else {
      Swal.fire("Error", resData.message || "Failed to send OTP", "error");
    }
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    Swal.fire("Error", "Something went wrong", "error");
  }
};

const handleOtpChange = (value: string, index: number) => {
  if (!/^\d*$/.test(value)) return;

  const newOtp = [...otp];
  newOtp[index] = value;
  setOtp(newOtp);

  if (value && index < otpRefs.current.length - 1) {
    otpRefs.current[index + 1]?.focus();
  }
};

const handleOtpSubmit = async () => {
  const enteredOtp = otp.join("");

  if (enteredOtp.length === 4) {
    try {
      const response = await fetch(`${BASE_URL}/${API_CONFIG.USER_ENDPOINTS.VERIFY_OTP_FORGOT_PASSWORD}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailValue,
          otp: enteredOtp,
          userType: "user",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire("Success", "OTP verified successfully!", "success");
        navigate("/user/reset-password", { state: { email: emailValue } });
      } else {
        Swal.fire("Error", data.message || " Invalid OTP", "error");
      }
    } catch (error) {
      console.error(" Error verifying OTP:", error);
      Swal.fire("Error", "Something went wrong. Please try again.", "error");
    }
  } else {
    Swal.fire("Warning", "Please enter a valid 4-digit OTP", "warning");
  }
};



  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-100 to-green-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md text-center space-y-6">
        <h1 className="text-2xl font-bold text-gray-700">Forgot Password</h1>

        <form onSubmit={handleSubmit(onEmailSubmit)} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              value={emailValue}
              readOnly={emailSubmitted}
              onChange={(e) => setEmailValue(e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none ${emailSubmitted
                  ? "bg-gray-500 cursor-not-allowed"
                  : "border-green-500-300 focus:ring-2 focus:ring-green-500"
                }`}
            />
            {errors.email && !emailSubmitted && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message as string}
              </p>
            )}
          </div>

          {!emailSubmitted && (
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Send OTP
            </button>
          )}
        </form>

        {/* Back to login link below email */}
        {!emailSubmitted && (
          <button
            className="text-sm text-blue-600 hover:underline mt-2"
            onClick={() => navigate("/user/login")}
          >
            ← Back to Login
          </button>
        )}

        {/* OTP Section */}
        {emailSubmitted && (
          <div className="space-y-4 transition-all duration-300">
            <h2 className="text-lg font-semibold text-gray-600">Enter OTP</h2>
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  ref={(el) => {
                    otpRefs.current[index] = el;
                  }}
                  className="w-12 h-12 text-center text-xl font-semibold border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ))}
            </div>

            <button
              onClick={handleOtpSubmit}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Verify OTP
            </button>
         
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotOtp;
