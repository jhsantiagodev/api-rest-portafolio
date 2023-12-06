const jwt = require("jwt-simple");
const moment = require("moment");

const libJwt = require("../servises/jwt");
const secret = libJwt.secret;

exports.auth = (req, res , next) => {

   //comprobar cabezera de autorizacion
   if (!req.headers.authorization) {

      return res.status(403).send({
         status: "Error",
         message: "The request dont have headers authorization"
      });
   }

   //Limpiar token comillas y vacio
   let token = req.headers.authorization.replace(/['"]+/g ,'');

   //Decodificar token
   try {
      let payload = jwt.decode(token, secret);

      if (payload.exp <= moment().unix()) {
         return res.status(401).send({
            status: "Error",
            message: "the token as expired"
         });
      }

   //agregar dato de useario a la req
      req.user = payload;

   } catch (error) {
      
      return res.status(404).send({
         status: "Error",
         message: "Token invalid",
         error
      });
   }

   //pasar a la ejecucion de la accion
   next();
}