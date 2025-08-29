"use client";

import { useEffect, useState } from "react";
import { ClipboardCheck, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { getPendingCreators, approveCreator, rejectCreator } from "../../services/admin/adminService"
import Swal from "sweetalert2";

import Navbar from "../layout/admin/SideBar";

interface Creator {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
}

export default function ApprovalsPage() {
  const [pendingCreators, setPendingCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const data = await getPendingCreators();
        setPendingCreators(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, []);

  const totalPages = Math.ceil(pendingCreators.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCreators = pendingCreators.slice(startIndex, endIndex);

  const handleApprove = async (creatorId: string) => {
    try {
      const data = await approveCreator(creatorId);
      console.log(data.message);
      setPendingCreators(pendingCreators.filter(c => c._id !== creatorId));

      const newTotalPages = Math.ceil((pendingCreators.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (creatorId: string) => {
    const { value: reason } = await Swal.fire({
      title: "Reject Creator",
      input: "text",
      inputLabel: "Enter the rejection reason",
      inputPlaceholder: "Type your reason here...",
      showCancelButton: true,
      confirmButtonText: "Reject",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      inputValidator: (value) => {
        if (!value) {
          return "Rejection reason is required!";
        }
        return null;
      },
    });

    if (!reason) return;

    try {
      const data = await rejectCreator(creatorId, reason);
      await Swal.fire({
        icon: "success",
        title: "Creator Rejected",
        text: data.message,
        confirmButtonColor: "#3085d6",
      });

      setPendingCreators((prev) => prev.filter((c) => c._id !== creatorId));

      const newTotalPages = Math.ceil((pendingCreators.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while rejecting the creator.",
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <Navbar />
      <div className="w-3xl">
        <div className="flex items-center mb-7">
          <ClipboardCheck className="h-8 w-8 text-green-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Pending Creator Approvals</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="text-center p-8">Loading...</div>
          ) : pendingCreators.length === 0 ? (
            <div className="text-center p-8 text-gray-500">No pending approvals.</div>
          ) : (
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-black text-white uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Registration Date</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentCreators.map((creator) => (
                  <tr key={creator._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{creator.name}</td>
                    <td className="px-6 py-4">{creator.email}</td>
                    <td className="px-6 py-4">{new Date(creator.createdAt).toDateString()}</td>
                    <td className="px-6 py-4 flex items-center justify-center space-x-3">
                      <button
                        className="flex items-center px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md text-xs"
                        onClick={() => handleApprove(creator._id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </button>
                      <button
                        className="flex items-center px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-xs"
                        onClick={() => handleReject(creator._id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loading && pendingCreators.length > 0 && (
          <div className="mt-8 flex items-center justify-center">


            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1 || totalPages <= 1}
                className={`flex items-center px-3 py-2 text-sm rounded-md ${currentPage === 1 || totalPages <= 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>

              <div className="flex items-center space-x-1">
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' && totalPages > 1 && handlePageChange(page)}
                    disabled={page === '...' || totalPages <= 1}
                    className={`px-3 py-2 text-sm rounded-md ${page === currentPage && totalPages > 1
                      ? 'bg-blue-600 text-white'
                      : page === '...' || totalPages <= 1
                        ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages || totalPages <= 1}
                className={`flex items-center px-3 py-2 text-sm rounded-md ${currentPage === totalPages || totalPages <= 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}