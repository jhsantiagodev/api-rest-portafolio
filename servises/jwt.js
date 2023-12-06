const jwt = require("jwt-simple");
const moment = require("moment");

//clave secreta
const secret = "CLAVE_SECRETA_del_proyecto_portafolio_12345678";

const createToken = (user) => {

   const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      iat: moment().unix(),
      exp: moment().add(50, "days").unix()
   };

   return jwt.encode(payload, secret);

};

module.exports = {
   createToken,
   secret
}