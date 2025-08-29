import { useState } from "react";
import { Link } from "react-router-dom";
import { Ticket, Wallet, Lock } from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  hovered: boolean;
}

const Sidebar = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        fixed top-1/2 left-4 transform -translate-y-1/2 
        bg-gray-900 text-white rounded-2xl shadow-lg
        transition-all duration-300 ease-in-out overflow-hidden
        flex flex-col justify-center
      `}
      style={{
        width: hovered ? "200px" : "64px",
        height: "240px",
      }}
    >
      <nav className="flex flex-col gap-4 px-2">
        <SidebarItem icon={<Ticket size={20} />} label="Tickets" to="/user/tickets" hovered={hovered} />
        <SidebarItem icon={<Wallet size={20} />} label="Wallet" to="/user/wallet" hovered={hovered} />
        <SidebarItem icon={<Lock size={20} />} label="Change Password" to="/user/change-password" hovered={hovered} />
      </nav>
    </div>
  );
};

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, to, hovered }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200"
  >
    <span className="flex justify-center items-center min-w-[24px]">{icon}</span>
    <span
      className={`whitespace-nowrap transition-opacity duration-300 ${
        hovered ? "opacity-100" : "opacity-0"
      }`}
    >
      {label}
    </span>
  </Link>
);

export default Sidebar;
