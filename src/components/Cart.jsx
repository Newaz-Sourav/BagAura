import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Cart({ user, userLoading }) {
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();

  // Redirect only when user check is finished
  useEffect(() => {
    if (!userLoading && !user) {
      toast.error("You must login first!", { autoClose: 2000, position: "top-center" });
      const timer = setTimeout(() => navigate("/login"), 2100);
      return () => clearTimeout(timer);
    }
  }, [user, userLoading, navigate]);

  // Fetch cart
  const fetchCart = async () => {
    if (!user) return;

    try {
      const res = await axios.get(
        "https://ecommerce-backend-ccc8.onrender.com/user/cart",
        { withCredentials: true }
      );
      setCart(res.data.cart);
      setCartTotal(res.data.cartTotal);
    } catch (err) {
      console.error("Error fetching cart:", err);
      toast.error("Failed to load cart", { autoClose: 2000, position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  // ---- ORDER NOW FUNCTION ----
  async function handlePlaceOrder() {
    try {
      setPlacingOrder(true);
      const res = await axios.post(
        "https://ecommerce-backend-ccc8.onrender.com/order/placeorder",
        {
          name: user.fullname,
          email: user.email,
          location: "Dhaka", // you can replace this with user input (address form)
          phone: user.contact || 123456789, // fallback if no phone in user
        },
        { withCredentials: true }
      );

      toast.success("Order placed successfully!", { autoClose: 2000, position: "top-center" });
      setCart([]); // clear frontend cart
      setCartTotal(0);
      console.log("Order Response:", res.data);
    } catch (err) {
      console.error("Order failed:", err);
      toast.error("Failed to place order", { autoClose: 2000, position: "top-center" });
    } finally {
      setPlacingOrder(false);
    }
  }

  if (userLoading) return <div className="text-center mt-20 text-lg font-medium">Checking login...</div>;
  if (!user) return null;
  if (loading) return <div className="text-center mt-20 text-lg font-medium">Loading cart...</div>;
  if (cart.length === 0) return <div className="text-center mt-20 text-lg font-medium">Your cart is empty.</div>;

  return (
    <div className="container mx-auto p-4 mt-20">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="flex flex-col gap-4">
        {cart.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-4 p-4 rounded-xl shadow-md relative"
          >
            {/* Cross button */}
            <button
              onClick={() => handleRemoveCompletely(item._id)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
              title="Remove item"
            >
              ✕
            </button>

            <div className="w-20 h-20 flex-shrink-0">
              <img
                src={item.image ? `data:image/jpeg;base64,${item.image}` : ""}
                alt={item.name}
                className="w-full h-full object-contain rounded-md"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-sm font-medium mt-1">Price: ৳{item.price.toFixed(2)}</p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => handleDecrease(item._id)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  -
                </button>
                <span className="px-2">{item.quantity}</span>
                <button
                  onClick={() => handleIncrease(item._id)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            </div>
            <div className="text-right font-bold">
              Subtotal: ৳{(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}

        {/* Cart total */}
        <div className="mt-6 text-right text-xl font-bold">
          Total: ৳{cartTotal.toFixed(2)}
        </div>

        {/* ---- ORDER NOW BUTTON ---- */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handlePlaceOrder}
            disabled={placingOrder}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 disabled:opacity-50"
          >
            {placingOrder ? "Placing Order..." : "Order Now"}
          </button>
        </div>
      </div>
    </div>
  );

  // Helper functions
  async function handleIncrease(productId) {
    try {
      await axios.post(
        `https://ecommerce-backend-ccc8.onrender.com/user/addtocart/${productId}`,
        {},
        { withCredentials: true }
      );
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDecrease(productId) {
    try {
      await axios.post(
        `https://ecommerce-backend-ccc8.onrender.com/user/removefromcart/${productId}`,
        {},
        { withCredentials: true }
      );
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRemoveCompletely(productId) {
    try {
      await axios.post(
        `https://ecommerce-backend-ccc8.onrender.com/user/removefromcart/${productId}`,
        { removeCompletely: true },
        { withCredentials: true }
      );
      toast.success("Item removed from cart", { autoClose: 1500, position: "top-center" });
      fetchCart();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item", { autoClose: 2000, position: "top-center" });
    }
  }
}
