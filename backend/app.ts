import express from "express";
import { errorHandler } from "./middleware/error.handler.js";
import messageRoute from "./routes/message.route.js";
import setupRoute from "./routes/setup.route.js";

const app = express();

app.use(express.json());

// Routes
app.use("/api/v1/setup", setupRoute);
app.use("/api/v1/messages", messageRoute);

app.get("/", (_, response) => {
  response.json({ info: "It works!" });
});

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
