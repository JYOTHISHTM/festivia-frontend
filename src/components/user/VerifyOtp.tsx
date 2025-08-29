import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config/config";
import { API_CONFIG } from "../../config/config";
import axios from "axios";

const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [otpExpired, setOtpExpired] = useState(false);

  const navigate = useNavigate();
  const email = sessionStorage.getItem("email");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) navigate("/user/signup");
    startTimer();
  }, [email, navigate]);

  const startTimer = () => {
    setIsResendDisabled(true);
    setTimer(30);
    setOtpExpired(false);

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setIsResendDisabled(false);
          setOtpExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleChange = (index: number, value: string) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otpExpired) {
      setError("OTP has expired. Please request a new one.");
      return;
    }

    const otpCode = otp.join("");
    console.log("otp code : ",otpCode);
    

    try {
      const response = await axios.post(`${BASE_URL}${API_CONFIG.USER_ENDPOINTS.VERIFY_OTP}`, {
        email,
        otp: otpCode,
        userType: "user",
      });
      if (response.data.success) {
        sessionStorage.removeItem("email");
        navigate("/user/login");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
  }


  const handleResendOtp = async () => {
    setOtp(["", "", "", ""]);
    inputRefs.current[0]?.focus();
    startTimer();
    try {
      await axios.post(`${BASE_URL}${API_CONFIG.USER_ENDPOINTS.RESEND_OTP}`, {
        email,
        type: "user",
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <div className="w-96 p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Verify OTP</h1>
        <p className="text-center text-gray-500 mb-4">Enter the 4-digit OTP sent to {email}</p>

        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="flex space-x-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-12 h-12 text-xl text-center border rounded"
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Verify OTP Button - Disabled when OTP expires */}
          <button
            type="submit"
            className={`w-full py-2 rounded ${otpExpired ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            disabled={otpExpired}
          >
            Verify OTP
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-red-500 text-sm font-semibold">Resend OTP in: {timer}s</p>
          <button
            className={`mt-2 px-4 py-2 rounded ${isResendDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            onClick={handleResendOtp}
            disabled={isResendDisabled}
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
