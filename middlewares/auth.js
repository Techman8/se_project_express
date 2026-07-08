const jwt = require("jsonwebtoken");
const { UNAUTHORIZED } = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

const authorize = (req, res, next) => {
  // 1. Exclude public routes from authorization check
  const publicRoutes = [
    { method: "POST", path: "/signin" },
    { method: "POST", path: "/signup" },
    { method: "GET", path: "/items" },
  ];

  // The arrow function inside .some() now explicitly returns a value
  const isPublicRoute = publicRoutes.some(
    (route) => route.method === req.method && route.path === req.path
  );

  if (isPublicRoute) {
    return next(); // Return here to stop execution of the rest of this function
  }

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(UNAUTHORIZED).json({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next(); // Explicitly return the next() call
  } catch (error) {
    return res.status(UNAUTHORIZED).json({ message: "Authorization required" });
  }
};

module.exports = authorize;
