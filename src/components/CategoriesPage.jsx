import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function CategoriesPage({ sortBy, priceRange, user }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const scrollRefs = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://ecommerce-backend-ccc8.onrender.com/products"
        );
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
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
    try {
      await axios.post(
        `https://ecommerce-backend-ccc8.onrender.com/user/addtocart/${productId}`,
        {},
        { withCredentials: true }
      );
      toast.success("Product added to cart");
    } catch (err) {
      toast.error("Failed to add product");
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-20 text-lg font-medium">
        Loading categories...
      </div>
    );

  let filteredProducts = products
    .filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

  if (sortBy === "price-low-high") filteredProducts.sort((a, b) => a.price - b.price);
  if (sortBy === "price-high-low") filteredProducts.sort((a, b) => b.price - a.price);
  if (sortBy === "newest") filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const categories = {};
  filteredProducts.forEach((p) => {
    if (!categories[p.category]) {
      categories[p.category] = [];
      scrollRefs.current[p.category] = React.createRef();
    }
    categories[p.category].push(p);
  });

  const scroll = (cat, dir) => {
    const ref = scrollRefs.current[cat];
    if (ref && ref.current) {
      ref.current.scrollBy({
        left: dir === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      {/* Search */}
      <div className="flex justify-center mb-10 mt-12">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                       transition-all duration-200 text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Categories */}
      {Object.keys(categories).map((cat) => (
        <div key={cat} className="mb-12 relative">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6">{cat}</h2>

          {/* Desktop carousel */}
          <div className="hidden md:block relative">
            <button
              onClick={() => scroll(cat, "left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 
                         bg-white p-2 rounded-full shadow hover:bg-gray-100"
            >
              <ChevronLeft />
            </button>

            <div
              ref={scrollRefs.current[cat]}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-12"
            >
              {categories[cat].map((product) => (
                <div
                  key={product._id}
                  className="relative rounded-xl overflow-hidden shadow-lg w-64 flex-shrink-0 
                             transition-transform hover:scale-105"
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
                    <h2 className="text-sm font-semibold truncate">
                      {product.name || "Product"}
                    </h2>
                    <p className="text-sm font-medium mt-1">
                      {product.discount ? (
                        <div className="flex items-center gap-2">
                          <span className="line-through" style={{ color: product.textcolor }}>
                            {(product.price + product.discount).toFixed(2)}
                          </span>
                          <span className="text-sm font-bold" style={{ color: product.textcolor }}>
                            {product.price.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm font-bold" style={{ color: product.textcolor }}>
                          {product.price.toFixed(2)}
                        </span>
                      )}
                    </p>

                    <div
                      onClick={() => handleAddToCart(product._id)}
                      className="absolute -top-4 right-3 w-10 h-10 flex justify-center items-center 
                                 rounded-full text-lg font-bold shadow-md transition-transform 
                                 hover:scale-110 cursor-pointer"
                      style={{ backgroundColor: product.textcolor, color: product.panelcolor }}
                    >
                      +
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => scroll(cat, "right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 
                         bg-white p-2 rounded-full shadow hover:bg-gray-100"
            >
              <ChevronRight />
            </button>
          </div>

          {/* Mobile stacked layout */}
          <div className="md:hidden flex flex-col gap-4">
            {categories[cat].map((product) => (
              <div key={product._id} className="flex rounded-xl overflow-hidden shadow-lg">
                <div
                  className="flex-shrink-0 w-1/3 flex justify-center items-center"
                  style={{ backgroundColor: product.bgcolor }}
                >
                  <img
                    src={product.image ? `data:image/jpeg;base64,${product.image}` : ""}
                    alt={product.name}
                    className="w-20 h-20 object-contain rounded-md"
                  />
                </div>

                <div
                  className="flex-1 p-3 relative"
                  style={{ backgroundColor: product.panelcolor, color: product.textcolor }}
                >
                  <h2 className="text-sm font-semibold truncate">
                    {product.name || "Product"}
                  </h2>
                  <p className="text-sm font-medium mt-1">
                    {product.discount ? (
                      <div className="flex items-center gap-2">
                        <span className="line-through">
                          {(product.price + product.discount).toFixed(2)}
                        </span>
                        <span className="text-sm font-bold">
                          {product.price.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-bold">
                        {product.price.toFixed(2)}
                      </span>
                    )}
                  </p>

                  <div
                    onClick={() => handleAddToCart(product._id)}
                    className="absolute top-2 right-2 w-8 h-8 flex justify-center items-center 
                               rounded-full text-lg font-bold shadow-md transition-transform 
                               hover:scale-110 cursor-pointer"
                    style={{ backgroundColor: product.textcolor, color: product.panelcolor }}
                  >
                    +
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
