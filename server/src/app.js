import express from "express";
import cors from "cors";
import healthRoute from "./routes/health.route.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import productRoute from "./routes/product.route.js";
import holdRoute from "./routes/hold.route.js";
import orderRoute from "./routes/order.route.js";
import adminRoute from "./routes/admin.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoute);
app.use("/api/products", productRoute);
app.use("/api/holds", holdRoute);
app.use("/api/orders", orderRoute);
app.use("/api/admin", adminRoute);


app.use(errorMiddleware);

export default app;
