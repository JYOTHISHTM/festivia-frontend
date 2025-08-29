import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../../assets/images/Screenshot 2025-03-07 173036.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { BASE_URL } from '../../../config/config';
import { API_CONFIG } from '../../../config/config';
import { logout } from "../../../redux/slice/creatorAuthSlice";

import {
  LayoutDashboard,
  Calendar,
  FileText,
  User,
  PlusSquare,
  MessageCircle,
  LogOut,
  BadgeDollarSign,
  Wallet
  
} from 'lucide-react';

interface Creator {
  name: string;
  createdAt: string;
}

const SidebarNavigation = () => {
  const location = useLocation();
  const [creator, setCreator] = useState<Creator | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const storedCreator = localStorage.getItem("creator");
    if (storedCreator) {
      setCreator(JSON.parse(storedCreator));
    }
  }, []);

  
  const handleLogout = async () => {
    try {
      const response = await fetch(`${BASE_URL}/${API_CONFIG.CREATOR.ENDPOINTS.LOGOUT}`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Logout failed");
      }

      console.log("✅ Logout successful");

      localStorage.removeItem("accessToken");
      // localStorage.removeItem("creatorToken");
      sessionStorage.removeItem("creator");
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      dispatch(logout()); 
      window.history.replaceState(null, "", "/creator/login");
      window.location.replace("/creator/login"); 

      navigate("/creator/login");
    } catch (err) {
      const error =err as Error
      console.error("❌ Error during logout:", error.message);
    }
  };

  const menuItems = [
    { id: 'DASHBOARD', icon: LayoutDashboard, label: 'DASHBOARD', path: '/creator/dashboard' },
    { id: 'EVENTS', icon: Calendar, label: 'EVENTS ', path: '/creator/events' },
    { id: 'SUBSCRIPTION_DETAILS', icon: FileText, label: 'SUBSCRIPTION DETAILS', path: '/creator/subscription-details' },
    { id: 'PROFILE', icon: User, label: 'EVENT PROFILE', path: '/creator/event-profile' },
    { id: 'CREATE_MANAGE_EVENTS', icon: PlusSquare, label: 'CREATE & MANAGE EVENTS', path: '/creator/create-and-manageEvents' },
    { id: 'MESSAGES', icon: MessageCircle, label: 'MESSAGES', path: '/creator/messages' },
    { id: 'BOOKING DETAILS', icon: MessageCircle, label: 'BOOKING DETAILS', path: '/creator/account' },
    { id: 'WALLET', icon: Wallet, label: 'WALLET', path: '/creator/wallet' },
    { id: 'SUBSCRIPTION', icon: BadgeDollarSign , label: 'SUBSCRIPTION', path: '/creator/subscription-history' },
    { id: 'LOGOUT', icon: LogOut, label: 'LOGOUT', action: handleLogout },
  ];

  const getCreationYear = () => {
    if (!creator || !creator.createdAt) return "";
    return new Date(creator.createdAt).getFullYear();
  };





  return (
    <div className="h-screen w-63  flex flex-col shadow-md">
      <div className="p-2 mb-2 flex justify-center">
        <img src={Logo} alt="Festivia Logo" className="h-16" />
      </div>

      <div className="flex-grow overflow-y-auto px-2">
        <style>
          {`
            .sidebar-menu::-webkit-scrollbar {
              display: none;
            }
            .sidebar-menu {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}
        </style>

        <div className="sidebar-menu">
          {menuItems.map((item) => {
            const isActive =
              item.id === "CREATE_MANAGE_EVENTS"
                ? location.pathname.startsWith("/creator/create-and-manageEvents") ||
                location.pathname.startsWith("/creator/create-event")
                : location.pathname === item.path;

            return item.id === "LOGOUT" ? (
              <button
                key={item.id}
                onClick={item.action}
                className={`flex items-center py-3 px-4 mb-1 cursor-pointer rounded-md w-full text-left ${isActive ? "bg-blue-300 shadow-md" : "bg-transparent hover:bg-blue-100"
                  }`}
              >
                <div className="w-6 h-6 mr-3 flex items-center justify-center">
                  <item.icon size={18} className="text-gray-700" />
                </div>
                <span className="text-gray-800 text-sm font-medium">{item.label}</span>
              </button>
            ) : (
              <Link
                to={item.path || "#"}
                key={item.id}
                className={`flex items-center py-3 px-4 mb-1 cursor-pointer rounded-md ${isActive ? "bg-blue-300 shadow-md" : "bg-transparent hover:bg-blue-100"
                  }`}
              >
                <div className="w-6 h-6 mr-3 flex items-center justify-center">
                  <item.icon size={18} className="text-gray-700" />
                </div>
                <span className="text-gray-800 text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

      </div>

      <div className="mt-auto border-t border-gray-200">
        <Link to="/creator/profile" className="flex items-center p-4 bg-transparent hover:bg-blue-100">
          <div className="w-8 h-8 rounded-md overflow-hidden mr-3">
            <img
              src="https://res.cloudinary.com/drha2z2qr/image/upload/v1742235053/icons8-user-100_vu6yb1.png"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-gray-800 text-xs font-medium">
              {creator ? creator.name : "Loading..."}
            </div>
            <div className="text-gray-500 text-xs">
              SINCE {getCreationYear()}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SidebarNavigation;