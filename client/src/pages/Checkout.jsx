import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Checkout() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [product, setProduct] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState(null);
  const [confirming, setConfirming] = useState(false);

  // 1️⃣ Fetch order
  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await api.get(`/orders/${orderId}`);
        setOrder(res.data);
        setTimeLeft(
          new Date(res.data.holdExpiresAt) - new Date()
        );
      } catch {
        setError("Order not found");
      }
    }

    fetchOrder();
  }, [orderId]);

  // 2️⃣ Fetch product after order is loaded
  useEffect(() => {
    if (!order) return;

    async function fetchProduct() {
      try {
        const res = await api.get(`/products/${order.productId}`);
        setProduct(res.data);
      } catch {
        setError("Failed to load product details");
      }
    }

    fetchProduct();
  }, [order]);

  useEffect(() => {
    if (!order) return;

    const interval = setInterval(() => {
      const diff =
        new Date(order.holdExpiresAt) - new Date();
      setTimeLeft(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [order]);

  
  async function handleConfirm() {
    try {
      setConfirming(true);
      await api.post(`/orders/${orderId}/confirm`);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Confirm failed");
    } finally {
      setConfirming(false);
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  if (!order || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading checkout...
      </div>
    );
  }

  const minutes = Math.max(0, Math.floor(timeLeft / 60000));
  const seconds = Math.max(0, Math.floor((timeLeft % 60000) / 1000));
  const expired = timeLeft <= 0;
  const totalPrice = product.price * order.quantity;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow p-6 w-96 space-y-4">

        <h1 className="text-xl font-bold">
          Checkout
        </h1>

        {/* Product Summary */}
        <div className="border rounded-lg p-3 bg-gray-50">
          <h2 className="text-sm">
            <strong>{product.name} :{product.description}</strong>
          </h2>

          <p className="mb-1">
            Quantity: <strong>{order.quantity}</strong>
          </p>


          <p className="text-sm text-gray-600">
            ₹{product.price} × {order.quantity}
          </p>

          <p className="mt-2 text-sm font-semibold">
            Total: ₹{totalPrice}
          </p>
        </div>

        {/* Hold Timer */}
        {!expired ? (
          <p className="text-red-600 text-sm">
            Hold expires in {minutes}m {seconds}s
          </p>
        ) : (
          <p className="text-red-600 text-sm">
            Hold expired Please return to the store
          </p>
        )}

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={expired || confirming}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium disabled:bg-gray-400"
        >
          {confirming ? "Confirming..." : "Confirm Order"}
        </button>
      </div>
    </div>
  );
}

export default Checkout;
