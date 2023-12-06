const connection = require("./database/connection");
const express = require("express");
const cors = require("cors");

console.log("API-REST RUN");

connection();

//server
const app = express();
const port = 3900;

//midelware
app.use(cors());

//convertir datos del body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
const userRoutes = require("./routes/user");
app.use("/api/user", userRoutes);

//server run
app.listen(port, () => {
   console.log("Server run on port: " + port);
});

