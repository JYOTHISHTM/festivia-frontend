
import { useEffect, useState } from "react";
import UserTable from "../../Reusable Component/UserTable";
import Sidebar from "../../components/layout/admin/SideBar";
import Swal from "sweetalert2";
import {
  getCreators,
  toggleCreatorBlockStatus,
} from "../../services/admin/adminService";

interface Creator {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
}

const CreatorsManagement = () => {
  const [creators, setCreators] = useState<Creator[]>([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await getCreators(""); 
      setCreators(data); 
    } catch (error) {
      Swal.fire("Error", "Failed to fetch creators", "error");
    }
  };

  fetchData();
}, []);


  const handleToggleBlock = async (id: string, isBlocked: boolean) => {
    const res = await Swal.fire({
      title: `Are you sure you want to ${isBlocked ? "Unblock" : "Block"} this creator?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (!res.isConfirmed) return;

    try {
      await toggleCreatorBlockStatus(id);
      setCreators((prev) =>
        prev.map((creator) =>
          creator._id === id ? { ...creator, isBlocked: !creator.isBlocked } : creator
        )
      );
      Swal.fire("Success", `Creator ${isBlocked ? "unblocked" : "blocked"} successfully`, "success");
    } catch (error) {
      console.error("Error toggling creator block status:", error);
      Swal.fire("Error", "Failed to update creator status", "error");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidebar />
      <div className="flex-1 p-4">
        <UserTable
          title="Creators Management"
          placeholder="Search creators..."
          items={creators}
          onSearch={getCreators}
          onToggleBlock={handleToggleBlock}
          itemsPerPage={10}
        />
      </div>
    </div>
  );
};

export default CreatorsManagement;
