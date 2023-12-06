const {Schema, model} = require("mongoose");

const UserSchema = Schema({
   name: {
      type: String,
   },

   password: {
      type: String,
      required: true
   },

   confirmPassword: {
      type: String,
      required: true
   },

   email: {
      type: String,
      required: true
   },

   image: {
      type: String,
      default: "default.png"
   }

});

module.exports = model("User", UserSchema, "users");