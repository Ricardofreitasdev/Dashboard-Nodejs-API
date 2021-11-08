var express = require("express");
var router = express.Router();
const apiController = require("../controller/apiController");
const jwt = require("jsonwebtoken");

router.get("/all-users", verifyJWT, apiController.index);
router.post("/create", apiController.create);
router.post("/auth", apiController.auth);
router.get("/user", verifyJWT, apiController.getUser);
router.get("/user/:id", verifyJWT, apiController.findOneById);


router.delete("/delete/:id", verifyJWT, apiController.deleteUser);

function verifyJWT(req, res, next){
    const token = req.headers['token'];
  
    if (!token) return res.status(401).json({ auth: false, message: 'Token é obrigatório' });
    
    jwt.verify(token, '123456', function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Falha na autenticação' });
      req.userId = decoded.id;
      next();
    });
}

module.exports = router;
