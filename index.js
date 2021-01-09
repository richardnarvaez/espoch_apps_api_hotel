var express = require("express");
var cors = require("cors");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var crud = require("./routes/crud");

var app = express();

const HOST = "localhost";
const PORT = "4000";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use("/api/v1", crud);

app.listen(
  {
    port: PORT,
  },
  () => {
    console.log(`Apollo Server on http://${HOST}:${PORT}/gql`);
  }
);
