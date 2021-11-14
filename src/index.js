(async () => {
  require("dotenv").config();
  const express = require("express");
  const apiRoutes = require("./routes/api");
  const cors = require("cors");
  const app = express();

  const database = require("./database/db");
  const User = require("./model/user");

  await database.sync();
  
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static("public"));
  
  app.use("/api", apiRoutes);
 

  app.listen(process.env.PORT || 3333, () => {
    console.log("server running");
  });
})();
