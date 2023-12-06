const mongoose = require("mongoose");

const connection = async () => {
   try {
      await mongoose.connect("mongodb://0.0.0.0:27017/mi_portafolio");
         console.log("conexion succefully DB");

   } catch (error) {
         console.log(error);
      throw new Error("Conexion Lost") 
   }

}

module.exports = connection;