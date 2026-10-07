const express =
  require("express");

const router =
  express.Router();

const {
  readJson,
} = require("../services/jsonDb");

// GET /api/sensors

router.get(
  "/",
  (req, res) => {
    const sensors =
      readJson("sensors.json");

    res.json(
      sensors
        .slice()
        .reverse()
    );
  }
);

// GET /api/sensors/latest

router.get(
  "/latest",
  (req, res) => {
    const sensors =
      readJson("sensors.json");

    if (sensors.length === 0) {
      return res.json({
        id: null,
        temperature: 0,
        humidity: 0,
        light: 0,
        recordedAt: null,
      });
    }

    res.json(
      sensors[
        sensors.length - 1
      ]
    );
  }
);

module.exports = router;