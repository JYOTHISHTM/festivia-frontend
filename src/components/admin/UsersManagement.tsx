
import Sidebar from "../../components/layout/admin/SideBar";
import Swal from "sweetalert2";
import { fetchUsers, toggleBlockUser } from "../../services/admin/adminService";
import { useState, useEffect } from "react";
import UserTable from "../../Reusable Component/UserTable";

interface User {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
}

const UsersManagement = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getUsers("");
  }, []);

  const getUsers = async (term: string) => {
    try {
      const res = await fetchUsers(term);
      setUsers(res);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch users", "error");
    }
  };

  const handleBlockToggle = async (id: string, isBlocked: boolean) => {
    const res = await Swal.fire({
      title: `Are you sure you want to ${isBlocked ? "Unblock" : "Block"} this user?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (!res.isConfirmed) return;

    try {
      const response = await toggleBlockUser(id);
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, isBlocked: !user.isBlocked } : user
        )
      );
      Swal.fire("Success", response.message, "success");
    } catch (error) {
      console.error("Error toggling user block status:", error);
      Swal.fire("Error", "Failed to update user status", "error");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidebar />
      <div className="flex-1 p-4">
        <UserTable
          title="Users Management"
          placeholder="Search users..."
          items={users}
          onSearch={getUsers}
          onToggleBlock={handleBlockToggle}
          itemsPerPage={10}
        />
      </div>
    </div>
  );
};

export default UsersManagement;