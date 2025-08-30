import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Products from "./components/Products";
import CategoriesPage from "./components/CategoriesPage";
import Discounted from "./components/Discounted";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Cart from "./components/Cart";

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

function App() {
  const location = useLocation();
  const [sortBy, setSortBy] = useState("newest");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 5000]);

  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          "https://ecommerce-backend-ccc8.onrender.com/user/profile",
          { withCredentials: true }
        );
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setUserLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setCart([]);
        setCartTotal(0);
        return;
      }
      try {
        const res = await axios.get(
          "https://ecommerce-backend-ccc8.onrender.com/user/cart",
          { withCredentials: true }
        );
        setCart(res.data.cart);
        setCartTotal(res.data.cartTotal);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };
    fetchCart();
  }, [user]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (!isSidebarOpen) setIsNavbarOpen(false);
  };

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
    if (!isNavbarOpen) setIsSidebarOpen(false);
  };

  const closeAll = () => {
    setIsSidebarOpen(false);
    setIsNavbarOpen(false);
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Sidebar */}
      <Sidebar
        sortBy={sortBy}
        setSortBy={setSortBy}
        isOpen={isSidebarOpen}
        onClose={closeAll}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />

      {/* Floating sidebar button for home, categories, discount pages */}
      {["/", "/categories", "/discount"].includes(location.pathname) &&
        !isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="fixed left-0 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-3 rounded-r-full shadow-lg z-[75] hover:bg-blue-700 transition md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

      <div className="flex">
        <div className="flex-1 md:ml-64">
          <Navbar
            isOpen={isNavbarOpen}
            toggleNavbar={toggleNavbar}
            toggleSidebar={toggleSidebar}
            user={user}
            setUser={setUser}
          />

          <Routes>
            <Route
              path="/"
              element={
                <Products
                  sortBy={sortBy}
                  priceRange={priceRange}
                  user={user}
                  setUser={setUser}
                />
              }
            />
            <Route
              path="/categories"
              element={
                <CategoriesPage
                  sortBy={sortBy}
                  priceRange={priceRange}
                  user={user}
                  setUser={setUser}
                />
              }
            />
            <Route
              path="/discount"
              element={
                <Discounted
                  sortBy={sortBy}
                  priceRange={priceRange}
                  user={user}
                  setUser={setUser}
                />
              }
            />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route
              path="/cart"
              element={
                <Cart
                  user={user}
                  userLoading={userLoading}
                  cart={cart}
                  setCart={setCart}
                  cartTotal={cartTotal}
                  setCartTotal={setCartTotal}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default AppWrapper;
