import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ sortBy, setSortBy, isOpen, onClose, priceRange, setPriceRange }) {
  const [localRange, setLocalRange] = useState(priceRange || [0, 5000]);

  useEffect(() => {
    setLocalRange(priceRange || [0, 5000]);
  }, [priceRange]);

  const min = 0;
  const max = 5000;

  const handleRangeChange = (value, index) => {
    const newRange = [...localRange];
    newRange[index] = Number(value);

    if (index === 0 && newRange[0] > newRange[1]) newRange[0] = newRange[1];
    if (index === 1 && newRange[1] < newRange[0]) newRange[1] = newRange[0];

    setLocalRange(newRange);
    setPriceRange?.(newRange);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-200/50 backdrop-blur-sm z-[60] md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-white p-6 flex flex-col justify-between pt-20
                    transform transition-transform duration-300 z-[70]
                    ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Close button */}
        {isOpen && (
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="md:hidden absolute top-3 right-3 h-10 w-10 rounded-full bg-white shadow ring-1 ring-gray-200
                       flex items-center justify-center text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Sort By */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Sort By</h2>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {/* Navigation */}
        <div className="flex flex-col space-y-2 mt-6">
          <NavLink to="/categories" className={({ isActive }) => `rounded-lg w-full text-left px-3 py-2 block ${isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"}`} onClick={onClose}>Categories</NavLink>
          <NavLink to="/" className={({ isActive }) => `rounded-lg w-full text-left px-3 py-2 block ${isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"}`} onClick={onClose}>All Products</NavLink>
          <NavLink to="/discount" className={({ isActive }) => `rounded-lg w-full text-left px-3 py-2 block ${isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"}`} onClick={onClose}>Discounted Products</NavLink>
        </div>

        {/* Price Range */}
        <div className="mt-6 sm:mt-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Price Range</h2>
          <div className="flex justify-between text-sm mb-2 font-medium text-gray-700">
            <span>Min: ৳{localRange[0]}</span>
            <span>To</span>
            <span>Max: ৳{localRange[1]}</span>
          </div>
          <div className="relative h-6">
            <div className="absolute w-full h-2 bg-gray-200 rounded top-1/2 -translate-y-1/2"></div>
            <div
              className="absolute h-2 bg-blue-500 rounded top-1/2 -translate-y-1/2"
              style={{
                left: `${(localRange[0] / max) * 100}%`,
                width: `${((localRange[1] - localRange[0]) / max) * 100}%`,
              }}
            />
            <input
              type="range"
              min={min}
              max={max}
              value={localRange[0]}
              onChange={(e) => handleRangeChange(e.target.value, 0)}
              className="absolute w-full h-6 appearance-none bg-transparent pointer-events-auto z-20"
            />
            <input
              type="range"
              min={min}
              max={max}
              value={localRange[1]}
              onChange={(e) => handleRangeChange(e.target.value, 1)}
              className="absolute w-full h-6 appearance-none bg-transparent pointer-events-auto z-20"
            />
          </div>
        </div>
      </div>
    </>
  );
}
