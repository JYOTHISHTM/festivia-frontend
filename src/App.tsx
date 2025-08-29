// FRONTEND>src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRoutes from "./routes/UserRoute"; 
import CreatorRoutes from "./routes/CreatorRoute"; 
import AdminRoutes from "./routes/AdminRoute";
import LandingPage from "./components/layout/user/LandingPage";
import { API_CONFIG } from "./config/config";





function App() {
  if (API_CONFIG.MAINTENANCE_MODE) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 text-center">
        <h1 className="text-3xl font-semibold text-gray-700">
           Festivia is currently under maintenance. Please check back later!
        </h1>
      </div>
    );
  }



  return (
    <Router>
      <Routes>
                <Route path="/" element={<LandingPage />} />

        <Route path="/user/*" element={<UserRoutes />} />
        <Route path="/creator/*" element={<CreatorRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
