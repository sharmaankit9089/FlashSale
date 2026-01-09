import { useState, useEffect } from "react";
import BuyModal from "./BuyModal";

function ProductCard({ product }) {
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const diff =
        new Date(product.saleEndsAt).getTime() - Date.now();
      setTimeLeft(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [product.saleEndsAt]);

  function formatTime(ms) {
    if (ms <= 0) return "00:00:00";

    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  const saleEnded = timeLeft <= 0;

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-5 flex flex-col">

        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          {product.name}
        </h2>

        <p className="text-sm text-gray-500 mb-2">
          {product.description}
        </p>

        <p className="text-2xl font-bold text-green-600">
          ₹{product.price}
        </p>

        <p
          className={`text-sm font-medium mt-1 mb-3 ${
            saleEnded ? "text-gray-400" : "text-red-600"
          }`}
        >
          {saleEnded
            ? "Sale ended"
            : `Ends in ${formatTime(timeLeft)}`}
        </p>

        <div className="flex justify-between text-sm mb-3">
          <span className="text-gray-600">Stock</span>
          <span className="font-medium">
            {product.liveStock} / {product.totalStock}
          </span>
        </div>

        <button
          disabled={saleEnded || product.liveStock === 0}
          onClick={() => setShowModal(true)}
          className="mt-auto bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Buy Now
        </button>
      </div>

      {showModal && (
        <BuyModal
          product={product}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default ProductCard;
