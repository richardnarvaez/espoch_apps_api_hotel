var express = require("express");
const { QueryTypes } = require("sequelize");
const sequelize = require("../connection");
var router = express.Router({ mergeParams: true });

var messageError = {
  error: {
    code: "400",
    message: "Invalid request",
  },
};

/* ------------------- ALL ------------------ */
/* ------------------------------------------ */
router.get("/empleados", async (req, res, next) => {
  const [results] = await sequelize.query("SELECT * FROM Empleados");
  res.json(results);
});

/* ----------------- FILTER ----------------- */
/* ------------------------------------------ */
// http://localhost:4000/api/v1/clientes/filter?cedula=09090
router.get("/empleados/filter?", async (req, res, next) => {
  const { cedula } = req.query;
  try {
    const [results] = await sequelize.query(
      "SELECT * FROM Empleados WHERE  cedula_emp Like '" + cedula + "%';"
    );
    res.json(results);
  } catch (e) {
    console.log(e);
    res.json({ success: false, msg: "No se pudo procesar la peticion" });
  }
});

// http://localhost:4000/api/v1/empleados/update
router.put("/empleados/update", async (req, res, next) => {
  const {
    cedula_emp,
    nombre_emp,
    apellido_emp,
    cargo_emp,
    direccion_emp,
    telefono_emp,
    usuario,
    password,
    status,
  } = req.body;
  console.log("UPDATE EMPLEADOS: ", req.body);
  sequelize
    .query(
      "UPDATE Empleados SET  " +
        "'" +
        nombre_emp +
        "','" +
        apellido_emp +
        "','" +
        cargo_emp +
        "','" +
        direccion_emp +
        "','" +
        nombre_emp +
        "','" +
        usuario +
        "','" +
        password +
        "','" +
        status +
        "'" +
        " WHERE cedula_emp ='" +
        cedula_emp +
        "'"
    )
    .then((data) => {
      console.log(data);
      res.json({
        success: true,
        msg: "Check Out Correcto",
      });
    })
    .catch((e) => {
      res.json({
        success: false,
        msg: "Problemas En Dar El Check Out De La Habitación",
      });
    });
});

router.post("/empleados/update/estado?", async (req, res, next) => {
  let { id, estado } = req.query;
  console.log("UPDATE ESTADO Empleado: ", req.query);
  if (estado == "False") {
    console.log(estado);
    estado = 0;
  } else {
    estado = 1;
  }
  sequelize
    .query(
      "UPDATE Empleados SET " +
        "status ='" +
        estado +
        "'" +
        " WHERE cedula_emp='" +
        id +
        "'"
    )
    .then((data) => {
      console.log(data);
      res.json({
        success: true,
        msg: "Se actualizo el estado correctamente.",
      });
    })
    .catch((e) => {
      res.json({
        success: false,
        msg: "Problemas En Dar El Check Out De La Habitación",
      });
    });
});

/* ----------------- INSERT ----------------- */
/* ------------------------------------------ */

router.post("/empleado", async (req, res, next) => {
  let {
    cedula_emp,
    nombre_emp,
    apellido_emp,
    cargo_emp,
    direccion_emp,
    telefono_emp,
    usuario,
    password,
    status,
  } = req.body;

  console.log("INSERTANDO EMPLEADO: " + req.body);
  const sqlQuery = `INSERT INTO Empleados 
        VALUES('${cedula_emp}','${nombre_emp}',
        '${apellido_emp}','${cargo_emp}','${direccion_emp}','${telefono_emp}',
        '${usuario}','${password}','${status}')`;

  sequelize
    .query(sqlQuery, { type: QueryTypes.INSERT })
    .then((data) => {
      console.log("Response: ", data);
      res.json({
        success: true,
        msg: "Empleado Registrado Correctamente",
      });
    })
    .catch((e) => {
      res.json({ success: false, msg: "Error: El empleado ya existe" });
    });
});

/* ------------ SELECT PARA LOGIN ----------- */
/* ------------------------------------------ */
router.post("/login", async (req, res, next) => {
  let { usuario, password } = req.body;
  const sqlQuery =
    "SELECT * FROM Empleados where usuario = '" +
    usuario +
    "' AND password = '" +
    password +
    "'";

  sequelize
    .query(sqlQuery, { type: QueryTypes.INSERT })
    .then((data) => {
      console.log("Response: ", data);
      let {
        usuario: _u,
        password: _p,
        status: _s,
        cedula_emp,
        nombre_emp,
        apellido_emp,
        cargo_emp,
      } = data[0][0];
      if (_u == usuario && _p == password && _s) {
        res.json({
          success: true,
          cedula: cedula_emp,
          name: nombre_emp + " " + apellido_emp,
          cargo: cargo_emp,
          msg: "Todo bien",
        });
      } else if (!_s) {
        res.json({
          success: false,
          msg: "Parece que el usuario esta bloqueado",
        });
      } else {
        res.json({
          success: false,
          msg: "Usuario o Contraseña Incorrecta",
        });
      }
    })
    .catch((e) => {
      console.log(e);
      res.json({ success: false, msg: "Error EN INICIAR SESIÓN no procesado" });
    });
});
module.exports = router;
