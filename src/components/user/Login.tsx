import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slice/authSlice";
import { BASE_URL } from "../../config/config";
import { API_CONFIG } from "../../config/config";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

import { createApiInstance } from "../../utils/authApi";
const api = createApiInstance("user");


const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });

  const navigate = useNavigate();
  const dispatch = useDispatch();



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



  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, validator: (value: string) => string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setter(value);
      setErrors((prev) => ({ ...prev, [e.target.id]: validator(value) }));
    };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, general: "" }));

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError, general: "" });
      return;
    }

    try {

      // const res = await api.post("http://localhost:5001/users/login",
      const res = await api.post(`${BASE_URL}/${API_CONFIG.USER_ENDPOINTS.LOGIN}`,
        { email, password, role: "user" },
        { withCredentials: true }
      );

      const { token, user } = res.data;

      if (res.status === 200) {
        dispatch(login({ user, token }));

        navigate("/user/home");
      } else {
        setErrors((prev) => ({ ...prev, general: res.data.message || "Invalid Credentials" }));
      }
    } catch (error: any) {
      console.error("❌ Server error:", error);

      const errorMessage = error.response?.data?.message || "Invalid Credentials. Please try again.";
      setErrors((prev) => ({ ...prev, general: errorMessage }));
    }
  };





  return (
    <div className="flex justify-center items-center min-h-screen  bg-gradient-to-b from-green-100/100 to-transparent p-6">
      <div className="form-card flex w-[900px] bg-white rounded-2xl shadow-lg overflow-hidden">


        <div className="w-1/2  flex justify-center items-center p-8">
          <img className="w-full h-auto rounded-xl transition-transform transform hover:scale-105" src="https://res.cloudinary.com/drha2z2qr/image/upload/v1741850318/27637692_7347889_kt6mtf.jpg" alt="Profile" />
        </div>

        <div className="w-1/2 p-8 bg-white">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">USER LOGIN</h1>
          <p className="text-center text-sm text-gray-600 mb-6">
            Don't have an account? <a href="/user/sign-up" className="text-blue-600 font-medium hover:text-blue-700">Sign up</a>
          </p>

          {errors.general && <p className="text-red-500 text-center mb-4">{errors.general}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="email" className="text-gray-700 font-medium">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleInputChange(setEmail, validateEmail)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600"
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>



            <div className="mb-5 relative">
              <label htmlFor="password" className="text-gray-700 font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={handleInputChange(setPassword, validatePassword)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>


            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg text-lg font-semibold cursor-pointer transition-all shadow-md hover:bg-green-600 hover:translate-y-[-2px] active:translate-y-0"
            >
              Log In
            </button>


            <button
              type="button"
              onClick={() => {
                window.location.href = `${BASE_URL}/users/google`;

              }}
              className="w-2/7 flex ml-35 items-center justify-center gap-3 mt-4 bg-white border-2 border-gray-300 py-3 rounded-lg text-lg font-semibold cursor-pointer transition-all shadow-md hover:bg-gray-200"
            >
              <FcGoogle size={24} />
            </button>


            <div className="text-center mt-4">
              <a
                onClick={() => navigate("/user/forgot-password")}
                className="text-gray-600 text-sm hover:underline cursor-pointer"
              >
                Forgot your password?
              </a>
            </div>


          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
