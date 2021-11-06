var express = require("express");
var router = express.Router();
const apiController = require("../controller/apiController");
const jwt = require("jsonwebtoken");


router.get("/", apiController.index);
router.post("/create", apiController.create);
router.post("/auth", apiController.auth);
router.get("/user", verifyJWT, apiController.getUser);


function verifyJWT(req, res, next){
    const token = req.headers['token'];
  
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, '123456', function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
      req.userId = decoded.id;
      next();
    });
}

module.exports = router;
