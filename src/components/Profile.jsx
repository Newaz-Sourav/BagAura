import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "https://ecommerce-backend-ccc8.onrender.com/user/orders",
          { withCredentials: true }
        );
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Please login to view profile.
      </div>
    );

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Shipped: "bg-blue-100 text-blue-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen mt-20 container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h1>

      {/* User Info */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <p className="text-lg"><strong>Name:</strong> {user.fullname}</p>
        <p className="text-lg"><strong>Email:</strong> {user.email}</p>
      </div>

      {/* Orders */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">My Orders</h2>
      {loadingOrders ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300"
            >
              <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <p className="text-gray-700">
                  <strong>Order Date:</strong>{" "}
                  {new Date(order.orderDate).toLocaleString()}
                </p>
                <p className="text-gray-700">
                  <strong>Total:</strong> ${order.totalPrice}
                </p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    statusColors[order.order_status] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.order_status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                {order.items.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex flex-col items-center bg-gray-50 p-2 rounded-lg shadow-sm hover:scale-105 transition-transform duration-200"
                  >
                    <div className="w-24 h-24 flex items-center justify-center bg-white rounded-md overflow-hidden border border-gray-200">
                      <img
                        src={`data:image/png;base64,${item.product.image}`}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-gray-700 text-sm text-center mt-2 font-medium">
                      {item.product.name}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">x {item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
