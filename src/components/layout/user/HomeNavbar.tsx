import { useState } from 'react';
import { Calendar, Menu, X, User, LogOut, Home, Info,MessageCircle  } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { BASE_URL } from '../../../config/config';
import { API_CONFIG } from '../../../config/config';
import { logout } from '../../../redux/slice/authSlice';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${BASE_URL}/${API_CONFIG.USER_ENDPOINTS.LOGOUT}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Logout failed");
      }

      console.log("✅ Logout successful");

      localStorage.removeItem("accessToken");
      // localStorage.removeItem("userToken");
      sessionStorage.removeItem("user");
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      dispatch(logout());
      window.history.replaceState(null, "", "/user/login");
      window.location.replace("/user/login");

      navigate("/user/login");
    } catch (error: any) {
      console.error("❌ Error during logout:", error.message);
    }
  };


  
  const user = JSON.parse(localStorage.getItem("user") || "{}");


  return (
    <div className="bg-gray-400">
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative flex items-center group">
                <Calendar className="h-8 w-8 text-emerald-600 transform group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute -inset-1 bg-emerald-100 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                FESTIVIA
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="flex items-center space-x-15 ">
              <a
                href="/user/home"
                className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors duration-200"
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </a>
              <a
                href="/user/about"
                className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors duration-200"
              >
                <Info className="w-5 h-5" />
                <span>About</span>
              </a>
              <a
                href="/user/messages"
                className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors duration-200"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Messages</span>
              </a>
             
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-emerald-600 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>

              <div
                className="relative group"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={() => navigate("/user/profile")}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                  <User className="w-5 h-5 text-white" />
                </div>

                {hover && (
                  <div className="absolute   mt-15 top-1/2 -translate-y-1/2 py-3 px-4 w-40 bg-gradient-to-br from-white to-emerald-50 text-gray-800 rounded-xl shadow-2xl border border-emerald-200 transition-all duration-300 ease-out animate-fadeIn">
                    <p className="text-sm font-semibold text-emerald-800">{user?.name || "Guest User"}</p>
                    <p className="text-xs text-gray-600">{user?.email || "guest@example.com"}</p>
                  </div>
                )}
              </div>

            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-emerald-600 hover:bg-gray-50 transition-colors duration-200"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100">
            <div className="px-4 py-3 space-y-3">
              <a
                href="/user/home"
                className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors duration-200"
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </a>
              <a
                href="/user/about"
                className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors duration-200"
              >
                <Info className="w-5 h-5" />
                <span>About</span>
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

export default App;