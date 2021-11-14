var express = require("express");
var router = express.Router();
const apiController = require("../controller/apiController");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = multer({ dest: "public/uploads/" });

router.post("/create", apiController.create);
router.post("/auth", apiController.auth);

router.post("/password/:id", verifyJWT, apiController.updatePass);
router.post("/admin/:id", verifyJWT, apiController.updatePassByAdmin);

router.get("/all-users", verifyJWT, apiController.index);
router.get("/user", verifyJWT, apiController.getUser);
router.get("/user/:id", verifyJWT, apiController.findOneById);

router.put(
  "/user/:id",
  verifyJWT,
  upload.single("avatar"),
  apiController.updateUser
);

router.delete("/delete/:id", verifyJWT, apiController.deleteUser);

function verifyJWT(req, res, next) {
  const token = req.headers["token"];

  if (!token) return res.json({ auth: false, message: "Token é obrigatório" });
  jwt.verify(token, "123456", function (err, decoded) {
    if (err) return res.json({ auth: false, message: "Falha na autenticação" });
    req.userId = decoded.id;
    next();
  });
}

module.exports = router;
