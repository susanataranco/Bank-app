import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(bodyParser.json());
// Routes
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
// Start Server
app.listen(PORT, () => {
    console.log(`Server running on ${process.env.BACKEND_API_URL}:${PORT}`);
});
