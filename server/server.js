const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./config/dbconnect");
const initRoutes = require("./routes/index");

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const hostname = process.env.HOST_NAME;
const port = process.env.PORT || 8888;

dbConnect();
initRoutes(app);

app.listen(port, hostname, () => {
  console.log(`Server is running on port http://${hostname}:${port}`);
});
