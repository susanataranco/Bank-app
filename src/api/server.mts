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

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url} from ${req.headers.origin}`);
  next();
});

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`Blocked by CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ✅ Ensure OPTIONS is allowed
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"]
}));

// ✅ Explicitly handle preflight `OPTIONS` requests
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.sendStatus(200);
});

// ✅ Middleware for parsing JSON requests
app.use(bodyParser.json());

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
