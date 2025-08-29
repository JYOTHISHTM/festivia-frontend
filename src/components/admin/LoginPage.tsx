import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../services/admin/adminService"; 
import { login } from "../../redux/slice/adminAuthSlice";
import { useDispatch } from "react-redux";


const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await adminLogin(username, password);
  
      if (response.status === 200) {
        const { token, admin } = response.data;
  
        // localStorage.setItem("adminToken", token);
        localStorage.setItem("accessToken", token);
  
        dispatch(login({ admin, token }));
  
        navigate("/admin/dashboard"); 
      }
    } catch (err) {
      setError("Invalid username or password!");
    }
  };
  
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
  <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
    <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">ADMIN LOGIN</h1>

    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

    <form className="w-full space-y-5" onSubmit={handleLogin}>
      <input 
        type="text" 
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 placeholder-gray-400"
      />
      <input 
        type="password" 
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 placeholder-gray-400"
      />
      <button 
        type="submit" 
        className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all duration-200"
      >
        SIGN IN
      </button>
    </form>
  </div>
</div>

  );
};

export default LoginPage;
