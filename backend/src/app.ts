
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "CareerSync API is running!",
    status: "success",
  });
});

export default app;
