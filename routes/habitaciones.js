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
//Filtro para la pantalla de inicioo, cargar habitaciones
router.get("/habitaciones", async (req, res, next) => {
  const [results] = await sequelize.query(
    "SELECT * FROM Habitaciones WHERE estado_hab <> 'F'"
  );
  results.map((item) => {
    switch (item.estado_hab) {
      case "D":
        item.estado_hab = "DISPONIBLE";
        break;
      case "O":
        item.estado_hab = "OCUPADO";
        break;
      case "F":
        item.estado_hab = "FUERA DE SERVICIO";
        break;
    }
  });
  res.json(results);
});

router.get("/habitaciones/lista", async (req, res, next) => {
  const [results] = await sequelize.query("SELECT * FROM Habitaciones");
  results.map((item) => {
    switch (item.estado_hab) {
      case "D":
        item.estado_hab = "DISPONIBLE";
        break;
      case "O":
        item.estado_hab = "OCUPADO";
        break;
      case "F":
        item.estado_hab = "FUERA DE SERVICIO";
        break;
    }
  });
  res.json(results);
});

/* ----------------- FILTER ----------------- */
/* ------------------------------------------ */
//Procedimiento para buscar una habitacion
router.get("/habitaciones/filter?", async (req, res, next) => {
  const { id } = req.query;
  const [results] = await sequelize.query(
    "SELECT * FROM Habitaciones WHERE  codigo_hab LIKE '%" + id + "%';"
  );
  results.map((item) => {
    switch (item.estado_hab) {
      case "D":
        item.estado_hab = "DISPONIBLE";
        break;
      case "O":
        item.estado_hab = "OCUPADO";
        break;
      case "F":
        item.estado_hab = "FUERA DE SERVICIO";
        break;
    }
  });
  res.json(results);
});

// http://localhost:4000/api/v1/habitaciones/update
router.put("/habitaciones/update", async (req, res, next) => {
  const { codigo_hab, tipo_hab, descr_hab, prcAlto, prcBajo } = req.body;
  console.log("UPDATE Habitaciones: ", req.body);
  sequelize
    .query(
      "UPDATE Habitaciones SET '" +
        tipo_hab +
        "','" +
        descr_hab +
        "','" +
        prcAlto +
        "','" +
        prcBajo +
        "'" +
        " WHERE codigo_hab='" +
        codigo_hab +
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

router.post("/habitaciones/update/estado?", async (req, res, next) => {
  const { id, estado } = req.query;
  console.log("UPDATE Habitaciones: ", req.query);

  sequelize
    .query(
      "UPDATE Habitaciones SET " +
        "estado_hab ='" +
        estado +
        "'" +
        " WHERE codigo_hab='" +
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

router.post("/habitaciones", async (req, res, next) => {
  let {
    codigo_hab,
    tipo_hab,
    estado_hab,
    descr_hab,
    prcAlto,
    prcBajo,
  } = req.body;

  console.log("NOMBRE: " + req.body);
  const sqlQuery = `INSERT INTO Habitaciones 
        VALUES('${codigo_hab}','${tipo_hab}',
        '${estado_hab}','${descr_hab}','${prcAlto}','${prcBajo}')`;

  sequelize
    .query(sqlQuery, { type: QueryTypes.INSERT })
    .then((data) => {
      console.log("Response: ", data);
      res.json({
        success: true,
        msg: "Habitacion Registrada Correctamente",
      });
    })
    .catch((e) => {
      console.log("Error:", e);
      res.json({
        success: false,
        msg: "Error: No pudo procesarse la creación habitacion",
      });
    });
});

module.exports = router;
