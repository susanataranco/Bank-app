import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
console.log(`Starting server in ${process.env.NODE_ENV} mode`);
const allowedOrigins = [
    "https://bank-app-gamma-three.vercel.app",
    "https://bank-app-production-b9b8.up.railway.app"
];
const app = express();
const PORT = process.env.PORT || 5000;
// ✅ Allow CORS
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization"
}));
// ✅ Handle Preflight OPTIONS requests
app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.sendStatus(200);
});
app.use(bodyParser.json());
// ✅ API Routes
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
// ✅ Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
