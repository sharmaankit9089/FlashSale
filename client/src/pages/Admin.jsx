import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { useState } from "react";
import SalesChart from "../components/SalesChart";

function Admin() {
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-metrics"],
    queryFn: async () => {
      const res = await api.get("/admin/metrics");
      return res.data;
    },
    refetchInterval: 5000
  });

  if (isLoading) {
    return <div className="p-6">Loading admin data...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Failed to load admin data</div>;
  }

  const filteredProducts = data.stockRemaining.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    
    <div className="min-h-screen bg-gray-100 p-6">
      <div className=" max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">
                Admin Dashboard
            </h1>

            <a href="/">
                <button className="rounded-lg bg-[#4a82eb] px-4 py-2 text-sm font-medium text-white hover: hover:bg-[#7eb4ea]">
                SalePage
                </button>
            </a>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Metric title="Total Holds" value={data.totalHoldsCreated} />
          <Metric title="Expired Holds" value={data.holdsExpired} />
          <Metric title="Confirmed Orders" value={data.confirmedOrders} />
        </div>


        <div className="bg-white rounded-xl shadow p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
                Stock
            </h2>

            <input
                type="text"
                placeholder="Search product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-sm border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200 text-sm">
                <th className="border p-2 text-left">S no.</th>
                <th className="border p-2 text-left">Product</th>
                <th className="border p-2 text-left">Total Stock</th>
                <th className="border p-2 text-left">Live Stock</th>
                <th className="border p-2 text-left">Pending</th>
                <th className="border p-2 text-left">Confirmed</th>
                <th className="border p-2 text-left">Expired</th>

                

              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p,index) => (
                <tr key={p.productId}>
                  <td className="border p-2">{index+1}</td>
                  <td className="border p-2">{p.name}</td>
                  <td className="border p-2">{p.totalStock}</td>
                  <td className="border p-2">{p.liveStock}</td>
                  <td className="border p-2">{p.pendingCount}</td>
                  <td className="border p-2">{p.confirmedCount}</td>
                  <td className="border p-2">{p.expiredCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6">
            <SalesChart
                sold={data.confirmedOrders}
                expired={data.holdsExpired}
            />
        </div>
      </div>
      
    </div>
  );
}

function Metric({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 text-center">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>button
    </div>
  );
}

export default Admin;
