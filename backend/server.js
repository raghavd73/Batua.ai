require("dotenv").config();

const express = require("express");
const cors = require("cors");
const stocksRouter = require("./routes/stocks");

const app = express();
const PORT = process.env.PORT || 5050;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "Batua backend",
  });
});

app.use("/api/stocks", stocksRouter);

app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((err, _req, res, _next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({
    message: "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Batua backend running on http://localhost:${PORT}`);
});