import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getToken, host, tokenKey } from "./Pages/Login/Auth/Auth";
import Layout from "./Pages/Layout/Layout";
import Login from "./Pages/Login/Login";

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem(tokenKey)
  console.log(token);
  useEffect(() => {
      if (!token) {
          navigate("/login");
      }
  }, [token]);

  return token ? <Layout><Outlet /></Layout> : <Login />; 
}

export default App;
