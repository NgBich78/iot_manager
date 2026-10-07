const express =
  require("express");

const router =
  express.Router();

// GET /api/users/me

router.get(
  "/me",
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;