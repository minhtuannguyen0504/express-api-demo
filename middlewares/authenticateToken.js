const jwt = require("jsonwebtoken");
const { User } = require("../models");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("req.headers", req.headers);
  if (token == null) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decodePayload) => {
    // Bước 1: Xử lý lỗi từ jwt.verify (token hết hạn, chữ ký sai,...)
    if (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: "Token expired" });
      }

      return res.status(403).json({ message: "Token invalid" });
    }

    // Bước 2: Token hợp lệ, lấy userId từ payload
    console.log("decodePayload", decodePayload);
    const userId = decodePayload.userId;
    if (!userId) {
      return res.status(403).json({ message: "Token invalid" });
    }

    // Bước 3: Query DB để lấy thông tin user đầy đủ
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        return res
          .status(401)
          .json({ message: "Unauthorized. User is not exist" });
      }

      // Hợp lệ, gắn user (lấy từ DB) vào request
      req.user = user;

      next();
    } catch (dbError) {
      console.error("Error query user in authenticateToken: ", dbError);
      next(dbError);
    }
  });
};

module.exports = authenticateToken;
