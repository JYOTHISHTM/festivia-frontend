import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Ticket, User, 
   LogOut, ChevronDown, ChevronUp,ClipboardCheck
} from "lucide-react";
import Logo from "../../../assets/images/Screenshot 2025-03-07 173036.png";
import { logout } from "../../../redux/slice/adminAuthSlice";
import { BASE_URL } from '../../../config/config';
import { API_CONFIG } from '../../../config/config';

import { useDispatch } from "react-redux";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [_, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); 
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${BASE_URL}/${API_CONFIG.ADMIN_ENDPOINTS.LOGOUT}`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Logout failed");
      }


      localStorage.removeItem("accessToken");
      // localStorage.removeItem("adminToken");
      sessionStorage.removeItem("admin");
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      dispatch(logout());
      window.history.replaceState(null, "", "/admin/login");
      window.location.replace("/admin/login");

      navigate("/admin/login");
    } catch (error: any) {
      console.error("❌ Error during logout:", error.message);
    }
  };

  const centerMenuItems = [
    { id: 'DASHBOARD', icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { id: 'ACCOUNT', icon: User, label: 'Account', path: '/admin/account' },
    { id: 'APPROVALS', icon: ClipboardCheck, label: 'Approvals', path: '/admin/approvals' },
  ];
  
  const dropdownItems = [
    { id: 'CREATORS_MANAGEMENT', icon: Users, label: 'Creators Management', path: '/admin/creatormanagement' },
    { id: 'USERS_MANAGEMENT', icon: Users, label: 'Users Management', path: '/admin/usersmanagement' },
    { id: 'SUBSCRIPTIONS', icon: Ticket, label: 'Subscriptions', path: '/admin/subscriptions' },
  ];

  const handleNavigation = (path?: string, action?: () => void) => {
    if (action) {
      action();
    } else if (path) {
      navigate(path);
    }
    
    setIsDropdownOpen(false);
  };

  return (
    <div className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="flex justify-between items-center py-3 px-6">
        <div className="flex items-center space-x-4">
          <img src={Logo} alt="Festivia Logo" className="h-10" />
        </div>

        <div className="flex items-center space-x-6">
          {centerMenuItems.map(({ id, icon: Icon, label, path }) => {
            const isActive = path && location.pathname === path;
            return (
              <div
                key={id}
                className={`flex items-center cursor-pointer ${isActive ? 'text-[#1DB954]' : 'text-gray-700'}`}
                onClick={() => handleNavigation(path)}
              >
                <Icon className="w-5 h-5" />
                <span className="ml-2 text-sm">{label}</span>
              </div>
            );
          })}
          
          {/* Dropdown for additional menu items */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 text-gray-700"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>More</span>
              {isDropdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isDropdownOpen && (
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-white shadow-lg rounded-lg w-48 py-2 z-50">
                {dropdownItems.map(({ id, icon: Icon, label, path }) => {
                  const isActive = path && location.pathname === path;
                  return (
                    <div
                      key={id}
                      className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 ${isActive ? 'text-[#1DB954]' : 'text-gray-700'}`}
                      onClick={() => handleNavigation(path)}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="ml-2 text-sm">{label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div 
          className="flex items-center cursor-pointer text-gray-700"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span className="ml-2 text-sm">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;