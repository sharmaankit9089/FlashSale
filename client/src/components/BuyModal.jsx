import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function BuyModal({ product, onClose }) {
  const [email, setEmail] = useState("");
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const isOutOfStock = qty > product.stock;

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleBuy() {
    if (!email) {
      setError("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Enter a valid email address");
      return;
    }

    if (isOutOfStock) {
      setError("Requested quantity exceeds available stock");
      return;
    }

    try {
    //   setLoading(true);
      setError(null);

      const res = await api.post("/holds", {
        productId: product.id,
        email,
        qty,
      });

      navigate(`/checkout/${res.data.orderId}`);
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-[#f5f5f5] bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 w-80">
        <h2 className="text-lg font-semibold mb-2">
          Buy {product.name}
        </h2>

        <p className="text-sm text-gray-600 mb-1">
          Available stock: {product.stock}
        </p>

        <input
          type="email"
          placeholder="Email"
          className="border w-full p-2 mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="number"
          min="1"
          className="border w-full p-2 mb-2"
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
        />

        {isOutOfStock && (
          <p className="text-red-600 text-sm mb-2">
            Quantity exceeds available stock
          </p>
        )}

        {error && (
          <p className="text-red-600 text-sm mb-2">
            {error}
          </p>
        )}

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 border py-1 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleBuy}
            disabled={loading || isOutOfStock}
            className={`flex-1 py-1 rounded text-white ${
              loading || isOutOfStock
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600"
            }`}
          >
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BuyModal;