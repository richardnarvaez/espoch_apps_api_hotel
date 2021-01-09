var express = require("express");
var cors = require("cors");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var clientes = require("./routes/clientes");
var empleados = require("./routes/empleados");
var habitaciones = require("./routes/habitaciones");
var reservas = require("./routes/reservas");
var alquileres = require("./routes/alquileres");

var app = express();

const HOST = "localhost";
const PORT = "4000";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use("/api/v1", clientes);
app.use("/api/v1", empleados);
app.use("/api/v1", habitaciones);
app.use("/api/v1", reservas);
app.use("/api/v1", alquileres);

app.listen(
  {
    port: PORT,
  },
  () => {
    console.log(`Server on http://${HOST}:${PORT}`);
  }
);
