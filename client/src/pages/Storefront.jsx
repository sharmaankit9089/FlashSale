import { useLiveProducts } from "../hooks/useLiveProducts";
import ProductCard from "../components/ProductCard";

function Storefront() {
  const { data, isLoading, error } = useLiveProducts();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Failed to load products
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            ⚡ Flash Sale
          </h1>
          <a href="/admin">
                <button className="rounded-lg bg-[#4a82eb] px-4 py-2 text-sm font-medium text-white hover: hover:bg-[#7eb4ea]">
                Admin Dashboard
                </button>
            </a>
        </div>
      </header>

      {/* Products */}
      <main className="max-w-6xl mx-auto p-6">
        {data.length === 0 ? (
          <p className="text-center text-gray-500">
            No active sales right now
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {data.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Storefront;
