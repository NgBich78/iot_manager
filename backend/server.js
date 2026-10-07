require("dotenv").config();

const express =
  require("express");

const cors =
  require("cors");

const authRoutes =
  require("./routes/authRoutes");

const sensorRoutes =
  require("./routes/sensorRoutes");

const deviceRoutes =
  require("./routes/deviceRoutes");

const actionRoutes =
  require("./routes/actionRoutes");

const userRoutes =
  require("./routes/userRoutes");

const authMiddleware =
  require("./middleware/authMiddleware");

const {
  startSensorSimulator,
} =
  require("./services/sensorSimulator");

const app = express();

const PORT =
  process.env.PORT || 3000;

// CORS

app.use(
  cors({
    origin:
      process.env.FRONTEND_URL,
  })
);

// JSON body

app.use(
  express.json()
);

// test server

app.get(
  "/",
  (req, res) => {
    res.json({
      message:
        "IOT Backend is running",
    });
  }
);

// Login không cần token

app.use(
  "/api/auth",
  authRoutes
);

// các route dưới đây cần login

app.use(
  authMiddleware
);

app.use(
  "/api/sensors",
  sensorRoutes
);

app.use(
  "/api/devices",
  deviceRoutes
);

app.use(
  "/api/actions",
  actionRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.listen(
  PORT,
  () => {
    console.log(
      `Backend running: http://localhost:${PORT}`
    );

    startSensorSimulator();
  }
);