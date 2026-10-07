const {
  readJson,
} = require("../services/jsonDb");

function authMiddleware(
  req,
  res,
  next
) {
  const authorization =
    req.headers.authorization;

  if (
    authorization !==
    "Bearer mock-iot-token"
  ) {
    return res
      .status(401)
      .json({
        message:
          "Unauthorized",
      });
  }

  const users =
    readJson("users.json");

  const user = users[0];

  req.user = {
    id: user.id,
    fullName: user.fullName,
    studentId: user.studentId,
    email: user.email,
    role: user.role,
  };

  next();
}

module.exports =
  authMiddleware;