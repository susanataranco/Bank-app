import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

console.log(`Starting server in ${process.env.NODE_ENV} mode`);
console.log(`Memory Limit: ${process.env.NODE_OPTIONS}`);

const allowedOrigins = [
  "https://bank-app-gamma-three.vercel.app",
  "https://bank-app-production-b9b8.up.railway.app"
];
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://bank-app-production-b9b8.up.railway.app";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: "GET,POST,PUT,DELETE,OPTIONS", // ✅ Allow necessary HTTP methods
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization"
}));
app.use(bodyParser.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on ${API_BASE_URL}`);
});
