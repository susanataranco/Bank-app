import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
console.log(`Starting server in ${process.env.NODE_ENV} mode`);
console.log(`Memory Limit: ${process.env.NODE_OPTIONS}`);
const allowedOrigins = process.env.NODE_ENV === "production"
    ? ["https://bank-app-production-b9b8.up.railway.app"]
    : ["http://localhost:3000"];
const BACKEND_API_URL = process.env.NODE_ENV === "production"
    ? "https://bank-app-production-b9b8.up.railway.app/api/users"
    : "http://localhost:5000";
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(bodyParser.json());
// Routes
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
// Start Server
app.listen(PORT, () => {
    console.log(`Server running on ${BACKEND_API_URL}`);
});
