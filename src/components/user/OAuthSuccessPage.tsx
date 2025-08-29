import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
// import api from "../../services/ApiService";


import { createApiInstance } from "../../utils/authApi";
const api = createApiInstance("user");


const OAuthSuccessPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.get("/users/oauth-user", { withCredentials: true });

        const { user, token } = res.data;

        if (user && token) {
          localStorage.setItem("accessToken", token);
          // localStorage.setItem("userToken", token);
          dispatch(login({ user, token }));
          navigate("/user/home");
        } else {
          navigate("/login/failed");
        }
      } catch (error) {
        console.error("OAuth Login Error", error);
        navigate("/login/failed");
      }
    };

    fetchUserData();
  }, [dispatch, navigate]);

  return <p className="text-center mt-20 text-lg">Logging in via Google, please wait...</p>;
};

export default OAuthSuccessPage;
