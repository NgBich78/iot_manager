const express =
  require("express");

const router =
  express.Router();

const {
  readJson,
} = require("../services/jsonDb");

router.get(
  "/",
  (req, res) => {
    res.json(
      readJson("actions.json")
    );
  }
);

module.exports = router;