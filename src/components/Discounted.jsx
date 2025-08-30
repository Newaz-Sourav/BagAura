import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Discounted({ sortBy, priceRange, user }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [addingToCart, setAddingToCart] = useState({}); // Track loading per product
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://ecommerce-backend-ccc8.onrender.com/products"
        );
        const discounted = res.data.filter((p) => p.discount && p.discount !== 0);
        setProducts(discounted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    if (!user) {
      toast.info("You need to login first");
      navigate("/login");
      return;
    }

    if (addingToCart[productId]) return; // Prevent multiple clicks

    try {
      setAddingToCart((prev) => ({ ...prev, [productId]: true }));
      await axios.post(
        `https://ecommerce-backend-ccc8.onrender.com/user/addtocart/${productId}`,
        {},
        { withCredentials: true }
      );
      toast.success("Product added to cart");
    } catch (err) {
      toast.error("Failed to add product");
      console.error(err);
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }));
    }
  };

  if (loading)
    return (
      <div className="text-center mt-20 text-lg font-medium">
        Loading discounted products...
      </div>
    );

  let filteredProducts = products
    .filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

  if (sortBy === "price-low-high") filteredProducts.sort((a, b) => a.price - b.price);
  if (sortBy === "price-high-low") filteredProducts.sort((a, b) => b.price - a.price);
  if (sortBy === "newest") filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Discounted Products</h1>

      <div className="flex justify-center mb-10">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search discounted products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>
      </div>

      <div
        className="grid gap-6 justify-center"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="relative rounded-xl overflow-hidden shadow-lg w-full min-w-[180px] max-w-[220px] transition-transform hover:scale-105 mx-auto"
              style={{ height: "320px" }}
            >
              <div
                className="flex justify-center items-center"
                style={{ backgroundColor: product.bgcolor, height: "70%" }}
              >
                <img
                  src={product.image ? `data:image/jpeg;base64,${product.image}` : ""}
                  alt={product.name}
                  className="w-44 h-44 object-contain rounded-md"
                />
              </div>

              <div
                className="relative flex flex-col justify-center p-3 rounded-b-xl"
                style={{
                  backgroundColor: product.panelcolor,
                  color: product.textcolor,
                  height: "30%",
                }}
              >
                <h2 className="text-sm font-semibold truncate">{product.name || "Product"}</h2>
                <p className="text-sm font-medium mt-1">
                  <div className="flex items-center gap-2">
                    <span className="line-through" style={{ color: product.textcolor }}>
                      {(product.price + product.discount).toFixed(2)}
                    </span>
                    <span className="text-sm font-bold" style={{ color: product.textcolor }}>
                      {product.price.toFixed(2)}
                    </span>
                  </div>
                </p>

                <div
                  onClick={() => handleAddToCart(product._id)}
                  className={`absolute -top-4 right-3 w-10 h-10 flex justify-center items-center rounded-full text-lg font-bold shadow-md transition-transform hover:scale-110 cursor-pointer ${
                    addingToCart[product._id] ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  style={{ backgroundColor: product.textcolor, color: product.panelcolor }}
                >
                  {addingToCart[product._id] ? "…" : "+"} {/* optional spinner */}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No discounted products found.</p>
        )}
      </div>
    </div>
  );
}
