import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export default function CheckoutModal({ isOpen, onClose, cart, cartTotal, user, onOrderPlaced }) {
  const [formData, setFormData] = useState({
    name: user?.fullname || "",
    email: user?.email || "",
    location: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, location, phone } = formData;
    if (!name || !email || !location || !phone) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "https://ecommerce-backend-ccc8.onrender.com/order/placeorder",
        { ...formData, paymentMethod: "Cash on Delivery" },
        { withCredentials: true }
      );

      toast.success("Order placed successfully!");
      onOrderPlaced(); // clear cart in parent
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl max-w-4xl w-full p-6 relative shadow-2xl overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-xl font-bold"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold mb-6 text-gray-800">Confirm Your Order</h2>

        {/* Cart Items with Images */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3 text-gray-700">Your Items</h3>
          <div className="max-h-64 overflow-y-auto space-y-3">
            {cart.map(item => (
              <div
                key={item._id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <div className="w-16 h-16 flex-shrink-0 bg-white rounded-md overflow-hidden border border-gray-200">
                  <img
                    src={item.image ? `data:image/jpeg;base64,${item.image}` : ""}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold text-gray-800">৳{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="text-right font-bold text-lg mt-3 text-gray-900">Total: ৳{cartTotal.toFixed(2)}</div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex flex-col">
              <label htmlFor="name" className="mb-1 font-medium text-gray-700">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label htmlFor="email" className="mb-1 font-medium text-gray-700">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex flex-col">
              <label htmlFor="location" className="mb-1 font-medium text-gray-700">Delivery Location</label>
              <input
                id="location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter your location"
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label htmlFor="phone" className="mb-1 font-medium text-gray-700">Phone Number</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Cash on Delivery Note */}
          <div className="text-gray-700 font-medium text-center bg-green-50 p-3 rounded-lg border border-green-200">
            Payment Method: <span className="text-green-800">Cash on Delivery</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
}
