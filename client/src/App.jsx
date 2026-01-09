import { Routes, Route } from "react-router-dom";
import Storefront from "./pages/Storefront";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Storefront />} />
      <Route path="/checkout/:orderId" element={<Checkout />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
