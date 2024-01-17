const jwt = require("jsonwebtoken");

const authCheck = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized: No token header",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized: No token",
      });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!verified) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized: Invalid Token",
      });
    }

    req.currentUser = verified;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Unauthorized: Unable to validate user",
    });
  }
};

const currentUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      if (token) {
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (verified) {
          req.currentUser = verified;
        }
      }
    }
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Unable to get current user details",
    });
  }
};

module.exports = {
  authCheck,
  currentUser,
};
