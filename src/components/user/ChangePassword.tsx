import { useState } from 'react';
import { Eye } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import HomeNavbar from '../layout/user/HomeNavbar';
import Sidebar from '../layout/user/SideBar';
import { userService } from '../../services/user/userService';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slice/authSlice'; 
import { BASE_URL } from '../../config/config';
import { API_CONFIG } from '../../config/config';
export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ current: '', new: '', confirm: '' });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validatePassword = (value: string) => {
    if (value.startsWith(" ")) return "Password cannot start with a space";
    if (value.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
    if (!/[0-9]/.test(value)) return "Password must contain at least one number";
    if (!/[@$!%*?&]/.test(value)) return "Password must contain at least one special character (@$!%*?&)";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let newErrors = { current: '', new: '', confirm: '' };

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    const newPassError = validatePassword(newPassword);
    if (newPassError) newErrors.new = newPassError;

    if (newPassword !== confirmPassword) {
      newErrors.confirm = "Passwords do not match";
    }

    if (Object.values(newErrors).some(msg => msg !== '')) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({ current: '', new: '', confirm: '' });

    try {
      const result = await userService.changePassword(currentPassword, newPassword);

      if (result.success) {
        toast.success(result.data.message || 'Password updated successfully', {
          icon: '✅',
          style: {
            borderRadius: '8px',
            background: '#d4edda',
            color: '#155724',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            padding: '10px 18px',
            fontWeight: 'normal',
          },
        });

        await fetch(`${BASE_URL}/${API_CONFIG.USER_ENDPOINTS.LOGOUT}`, {
          method: "GET",
          credentials: "include",
        });

        localStorage.removeItem('accessToken');
        // localStorage.removeItem('userToken');
        sessionStorage.removeItem('user');
        document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        dispatch(logout());

        setTimeout(() => {
          navigate("/user/login");
        }, 1000);
      } else {
        if (result.error === "Current password is incorrect") {
          setErrors(prev => ({ ...prev, current: "Current password is incorrect" }));
        } else {
          toast.error(result.error);
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputFields = [
    {
      label: 'Current Password',
      value: currentPassword,
      setValue: setCurrentPassword,
      show: showCurrentPassword,
      toggleShow: () => setShowCurrentPassword(!showCurrentPassword),
      id: 'current-password',
      error: errors.current,
    },
    {
      label: 'New Password',
      value: newPassword,
      setValue: setNewPassword,
      show: showNewPassword,
      toggleShow: () => setShowNewPassword(!showNewPassword),
      id: 'new-password',
      error: errors.new,
    },
    {
      label: 'Confirm New Password',
      value: confirmPassword,
      setValue: setConfirmPassword,
      show: showConfirmPassword,
      toggleShow: () => setShowConfirmPassword(!showConfirmPassword),
      id: 'confirm-password',
      error: errors.confirm,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <Toaster position="top-right" reverseOrder={false} />
      <HomeNavbar />
      <Sidebar />

      <div className="max-w-md w-full bg-white rounded-lg p-6 shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Change Password</h1>
        <form onSubmit={handleSubmit}>
          {inputFields.map(({ label, value, setValue, show, toggleShow, id, error }) => (
            <div key={id} className="mb-5">
              <label htmlFor={id} className="block text-sm text-gray-600 mb-1">
                {label}
              </label>
              <div className="relative">
                <input
                  id={id}
                  type={show ? "text" : "password"}
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                    setErrors(prev => ({ ...prev, [id.split("-")[0]]: '' }));
                  }}
                  className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={toggleShow}
                >
                  <Eye className="h-5 w-5 text-gray-400" />
                </button>
              </div>
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
          ))}

          <div className="flex justify-between">
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-md ${isSubmitting ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
