import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function Navbar({ isOpen, toggleNavbar, toggleSidebar, user, setUser }) {
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
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link to={"/"}>
            <h1 className="text-2xl font-bold text-blue-600 tracking-wide cursor-pointer">
              BagAura
            </h1>
          </Link>
        </div>

        {/* Desktop Menu */}
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

        {/* Mobile Navbar toggle */}
        {!isOpen && (
          <button
            onClick={toggleNavbar}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
      </div>

      {/* Mobile Navbar with smooth slide animation */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full bg-white z-[90] shadow-md transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex flex-col pt-16 px-4 pb-4 space-y-2 relative">
          {/* Close button */}
          <button
            onClick={toggleNavbar}
            className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            onClick={() => {
              if (!user) {
                toast.info("You need to login first");
                navigate("/login");
              } else {
                navigate("/cart");
              }
              toggleNavbar(); // ✅ close after click
            }}
            className="px-4 py-2 rounded-full bg-gray-600 text-white font-medium hover:bg-green-700 transition w-full text-center"
          >
            Cart
          </button>

          {user ? (
            <>
              <Link to="/profile" onClick={toggleNavbar}>
                <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition w-full text-center">
                  {user.fullname}
                </button>
              </Link>
              <button
                onClick={async () => {
                  await handleLogout();
                  toggleNavbar(); // ✅ close after logout
                }}
                className="px-4 py-2 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 transition w-full text-center"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={toggleNavbar}>
              <button className="px-4 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition w-full text-center">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
