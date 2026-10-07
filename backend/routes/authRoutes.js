const express =
  require("express");

const router =
  express.Router();

const {
  readJson,
} = require("../services/jsonDb");

router.post(
  "/login",
  (req, res) => {
    const {
      studentId,
      password,
    } = req.body;

    if (!studentId || !password) {
      return res
        .status(400)
        .json({
          message:
            "Student ID and password are required",
        });
    }

    const users =
      readJson("users.json");

    const user =
      users.find(
        (item) =>
          item.studentId === studentId &&
          item.password === password
      );

    if (!user) {
      return res
        .status(401)
        .json({
          message:
            "Student ID or password is incorrect",
        });
    }

    const userResponse = {
      id: user.id,
      fullName: user.fullName,
      studentId: user.studentId,
      email: user.email,
      role: user.role,
    };

    res.json({
      token: "mock-iot-token",
      user: userResponse,
    });
  }
);

module.exports = router;