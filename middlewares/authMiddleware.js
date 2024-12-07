const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Unauthorized: provide token" });
      }


      const decoded = await jwt.verify(token, process.env.JWT_SECRET);

      // req.user = await findUserById(decoded.id);
      req.user = decoded;
      req.token = token;

      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  } else{
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: provide token" });
    }
  }
};

module.exports = authMiddleware;
