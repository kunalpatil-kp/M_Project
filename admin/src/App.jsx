import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import Login from "./pages/Login/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const url = "https://food-delivery-fquq.onrender.com";
  const [token, setToken] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("admin_token");
    if (saved) {
      setToken(saved);
    }
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("admin_token", token);
    } else {
      localStorage.removeItem("admin_token");
    }
  }, [token]);

  if (!token) {
    return (
      <div>
        <ToastContainer />
        <Login url={url} setToken={setToken} />
      </div>
    );
  }

  return (
    <div>
      <ToastContainer />
      <Navbar setToken={setToken} />
      <hr />
      <div className="app-content">
        <Sidebar />

        <Routes>
          <Route path="/" element={<Navigate to="/add" replace />} />
          <Route path="/add" element={<Add url={url} token={token} />} />
          <Route path="/list" element={<List url={url} token={token} />} />
          <Route path="/orders" element={<Orders url={url} token={token} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
