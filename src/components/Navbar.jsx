import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function Navbar({ isOpen, toggleNavbar, user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://ecommerce-backend-ccc8.onrender.com/user/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      toast.error("Something went wrong during logout");
    }
  };

  return (
    <nav className="bg-white fixed top-0 left-0 w-full md:left-64 md:w-[calc(100%-16rem)] z-[80]">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-600 tracking-wide cursor-pointer">
          BagAura
        </h1>

        <div className="hidden md:flex space-x-4 items-center">
          <button
            onClick={() => {
              if (!user) {
                toast.info("You need to login first");
                navigate("/login");
              } else {
                navigate("/cart");
              }
            }}
            className="text-gray-700 hover:text-blue-600 transition font-medium"
          >
            Cart
          </button>

          {user ? (
            <>
              <Link to="/profile">
                <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition">
                  {user.fullname}
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">
              <button className="px-4 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
