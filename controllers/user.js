const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("../servises/jwt");
const fs = require("fs");

const prueba = (req, res) => {
   return res.status(200).send({message: "message of controllers"});
}

const register = (req, res) => {

   let params = req.body;

   if (!params.email || !params.password || !params.confirmPassword) {
         return res.status(400).json({
            status: "Error",
            message: "Fields are required"
         });
   }

   if (params.password !== params.confirmPassword) {
         return res.status(400).json({
            status: "Error",
            message: "Password does not match"
         });
   }

   //control de usuarios duplicados
   User.find({
      $or: [
         { email: params.email.toLowerCase() }
      ]
   }).exec(async (error, users) => {

      if (error) return res.status(500).json({status: "Error", message: "Error en la consulta"});

      if (users && users.length >= 1) {
         return res.status(200).send({
            status: "success",
            message: "User exist"
         });
      }
      
      //cifrar password
      let passCrypt = await bcrypt.hash(params.password, 10);
         params.password = passCrypt;

      let confirmPassCryp = await bcrypt.hash(params.confirmPassword, 10);
         params.confirmPassword = confirmPassCryp;

      let userSave = new User(params);

         userSave.save((error, userStored) => {

            if (error || !userStored) return res.status(500).send({status: "Error", message: "Error to save User"}); 
   
            return res.status(200).json({
               status: "success",
               message: "register successfully",
               userStored
            });
         });           
   });
}

const login = (req, res) => {

   let params = req.body;

   if (!params.email || !params.password) {
         return res.status(404).send({
            status: "Error",
            message: "Fields are required"
         });
   }

   //Buscar si existe en la DB
   User.findOne({ email: params.email })
       .exec((error, user) => {

         if(error || !user) return res.status(404).send({status: "Error", message: "User don't exist"});

         //comparar contraseñas, envio con la de la DB
         const pwd = bcrypt.compareSync(params.password, user.password);

            if (!pwd) {
               return res.status(400).send({
                  status: "Error",
                  message: "Password Incorrect"
               });
            }
         
         //Devolver token
         const token =  jwt.createToken(user);

         return res.status(200).json({
            status: "success",
            message: "You identify correctly",
            user: {
               id: user._id,
               email: user.email
            },
            token
         });

       });
   
}

const profile = (req, res) => {

   const id = req.params.id;
   
   //consulta para sacar los datos del usuario
   User.findById(id)
       .select({ password: 0, confirmPassword: 0 })
       .exec(async (error, userProfile) => {

         if (error || !userProfile) {
               return res.status(404).send({
                  status: "Error",
                  message: "User doesn't exist or error exist"
               });
         }

         return res.status(200).send({
            status: "success",
            message: "profile",
            user: userProfile
         });
       });    
}

const upload = (req, res) => {

   if (!req.file) {
      return res.status(404).send({
         status: "Error",
         message: "Request don't includes image"
      });
   }

   let image = req.file.originalname;

   const imageSplit = image.split("\.");
   const extencion = imageSplit[1];

   if (extencion != "png" && extencion != "jpg" && extencion != "jpeg" && extencion != "gif") {

      //borrar archivos que no coincidan
      const filePath = req.file.path;
      const fileDelete = fs.unlinkSync(filePath);

      return res.status(400).send({
         status: "Error",
         message: "Extention file incorrect"
      });
   }

   //Guardar en DB
   User.findOneAndUpdate({ _id: req.user.id }, { image: req.file.filename }, { new: true }, (error, userUpdateImage) => {

      if (error || !userUpdateImage) {

         return res.status(500).send({
            status: "Error",
            message: "Don't update"
         });
      }

      return res.status(200).send({
         status: "success",
         message: "Image save succefully",
         user: userUpdateImage,
         file: req.file
      });
   });
}

module.exports = {
   prueba,
   register,
   login,
   profile,
   upload
};