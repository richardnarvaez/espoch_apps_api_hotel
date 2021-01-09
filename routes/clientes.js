var express = require("express");
const { QueryTypes } = require("sequelize");
const sequelize = require("../connection");
var router = express.Router({ mergeParams: true });

/* ------------------- ALL ------------------ */
/* ------------------------------------------ */
router.get("/clientes", async(req, res, next) => {
    const [results] = await sequelize.query("SELECT * FROM Clientes", {
        type: QueryTypes.SELECT,
    });
    res.json(results);
});

/* ----------------- FILTER ----------------- */
/* ------------------------------------------ */
// http://localhost:4000/api/v1/clientes/filter?cedula=09090
router.get("/clientes/filter?", async(req, res, next) => {
    const { cedula } = req.query;
    const [
        results,
    ] = await sequelize.query(
        "SELECT * FROM Clientes WHERE  cedula_cli Like '" + cedula + "%';", { type: QueryTypes.SELECT }
    );
    res.json(results);
});

/* ----------------- INSERT ----------------- */
/* ------------------------------------------ */

router.post("/cliente", async(req, res, next) => {
    let {
        cedula_cli,
        nombre_cli,
        apellido_cli,
        direccion_cli,
        telefono_cli,
    } = req.body;

    console.log("NOMBRE: " + nombre_cli);
    const sqlQuery = `INSERT INTO Clientes 
        VALUES('${cedula_cli}','${nombre_cli}',
        '${apellido_cli}','${direccion_cli}','${telefono_cli}')`;

    sequelize
        .query(sqlQuery, { type: QueryTypes.INSERT })
        .then((data) => {
            console.log("Response: ", data);
            res.json({
                success: true,
                msg: "Cliente Registrado Correctamente",
            });
        })
        .catch((e) => {
            res.json({ success: false, msg: "Error: El cliente ya existe" });
        });
});

module.exports = router;