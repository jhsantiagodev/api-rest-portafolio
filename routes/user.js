const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
const checkAuth = require("../midleware/auth");
const multer = require("multer");

//configuracion subida de archivos
const storage = multer.diskStorage({

   destination: (req, file, cb) => {
      cb(null, "./uploads/avatars")
   },

   filename: (req, file, cb) => {
      cb(null, "avatar-"+Date.now()+"-"+file.originalname)
   }
});

const uploads = multer({storage});

router.get("/prueba", UserController.prueba);
router.post("/signup", UserController.register);
router.post("/login", UserController.login);
router.get("/profile/:id",checkAuth.auth, UserController.profile);
router.post("/upload",[checkAuth.auth, uploads.single("file0")], UserController.upload);

module.exports = router;