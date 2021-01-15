var express = require("express");
const { QueryTypes } = require("sequelize");
const sequelize = require("../connection");
var router = express.Router({ mergeParams: true });

/* ------------------- ALL ------------------ */
/* ------------------------------------------ */
router.get("/alquileres", async(req, res, next) => {
    const [results] = await sequelize.query("SELECT * FROM Alquileres");
    res.json(results);
});

//Post para insertar un alquiler
router.post("/alquilar", async(req, res, next) => {
    let {
        cedula_cliA,
        codigo_habA,
        cedula_empA,
        fechaIng_alq,
        fechaSal_alq,
        numDias_alq,
        temp_alq,
        prcTotal_alq,
        estado_alq,
    } = req.body;

    console.log("Datos: ", req.body);

    const sqlQueryInsert =
        "EXEC pr_InsertarAlquiler '" + cedula_cliA + "','" + codigo_habA + "','" + cedula_empA + "','" +
        fechaIng_alq + "','" + fechaSal_alq + "'," + numDias_alq + ",'" + temp_alq + "'," + prcTotal_alq + "";

    sequelize
        .query(sqlQueryInsert, QueryTypes.INSERT)
        .then((data) => {
            console.log(data);
            const [result, type] = data;
            console.log("Response: ", result, type);
            res.json({
                success: true,
                msg: "Información Guardada Exitosamente",
            });
            sequelize
                .query(sqlQueryUpdate)
                .then((i) => {
                    console.log(i);
                    const [result, type] = i;
                })
                .catch((e) => {
                    res.json({
                        success: false,
                        msg: "Error En Modificar El Estado De La Habitación",
                    });
                });
        })
        .catch((e) => {
            res.json({
                success: false,
                msg: "Error En Alquilar La Habitación:\n" + e,
            });
        });
});

//Metodo para entregar o finalizar un alquiler
router.put("/alquiler/checkoutalq", async(req, res, next) => {
    const { id_alquiler, codigo_habA } = req.body;
    console.log("BODY: ", req.body);
    sequelize
        .query(
            "EXECUTE pr_EntregarAlquiler " + id_alquiler + ", '" + codigo_habA + "'"
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

//Metodo para actualizar la fecha de salida de un alquiler
router.put("/alquiler/updatealq", async(req, res, next) => {
    const { id_alquiler, fechaSal_alq, prcTotal_alq, numDias_alq } = req.body;
    console.log("BODY: ", req.body);
    sequelize
        .query(
            "EXECUTE pr_ModificarAlquiler " + id_alquiler + ", '" + fechaSal_alq + "', " + prcTotal_alq + ", " + numDias_alq + " "
        )
        .then((data) => {
            console.log(data);
            res.json({
                success: true,
                msg: "El Alquiler Se Ha Modificado",
            });
        })
        .catch((e) => {
            res.json({
                success: false,
                msg: "Problemas En Actualizar Alquiler",
            });
        });
});

//Metodo para extraer los datos del alquiler 
router.get("/alquiler/ver?", async(req, res, next) => {
    const { id } = req.query;
    const [results] = await sequelize.query(
        "EXECUTE pr_DatosCheckOut   '" + id + "';"
    );
    res.json(results);
});
module.exports = router;