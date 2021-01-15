var express = require("express");
const { QueryTypes } = require("sequelize");
const sequelize = require("../connection");
var router = express.Router({ mergeParams: true });

/* ------------------- ALL ------------------ */
/* ------------------------------------------ */
router.get("/reservas", async(req, res, next) => {
    const [results] = await sequelize.query("SELECT * FROM vw_VistasReservas");
    res.json(results);
});

//Procedimiento para listar habitaciones que se encuentra disponible para reservar
router.get("/confirm_r?", async(req, res, next) => {
    console.log("PARAMS", req.params);
    console.log("PARAMS", req.query);
    console.log("PARAMS", req.body);
    const { fechaIng_res, fechaSal_res } = req.query;
    const [results] = await sequelize.query(`
    SELECT * FROM fn_ListarHabReservas('${fechaIng_res}','${fechaSal_res}');`);
    res.json(results);
});

/* ----------------- FILTER ----------------- */
/* ------------------------------------------ */
//Procedimiento para buscar una reserva por el id
router.get("/reservas/filter?", async(req, res, next) => {
    const { id } = req.query;
    console.log("FILTER RESERVA", req.query, req.params, req.body);
    sequelize
        .query("SELECT * FROM Reservas WHERE  id_reserva = '" + id + "'", {
            type: QueryTypes.SELECT,
        })
        .then((data) => {
            console.log(data);
            res.json(data); //ENVIAR DATOS //
        })
        .catch((e) => {
            console.log(e);
            res.json({ msg: "Error al ejecutar FILTER RESERVAS" });
        });
});

//Procedimiento para entregar la reserva al cliente
router.post("/reservar/checkout", async(req, res, next) => {
    let { id_reserva, temp_res } = req.body;
    console.log("ENTREGANDO LA RESERVA: ", req.body);

    const sqlQuery = `EXEC pr_EntregarReserva '${id_reserva}', '${temp_res}'`;

    sequelize
        .query(sqlQuery)
        .then((data) => {
            console.log("Response: ", data);
            //Metadata 1 IS OK
            res.json({
                success: true,
                msg: "Reserva Entregada Correctamente",
            });
        })
        .catch((e) => {
            console.log("Error: ", e);
            res.json({ success: false, msg: "Error: Reserva no procesada" });
        });
});

router.post("/reservar/modificar", async(req, res, next) => {
    let {
        numDias_res,
        prcTotal_res,
        abono_res,
        saldo_res,
        id_reserva,
    } = req.body;

    console.log("UPDATE RESERVA: ", req.body);

    const sqlQuery = `UPDATE Reservas  SET 
    numDias_res = '${numDias_res}',
    prcTotal_res = '${prcTotal_res}',
    abono_res = '${abono_res}',
    saldo_res = '${saldo_res}'
    WHERE id_reserva=${id_reserva}`;

    sequelize
        .query(sqlQuery)
        .then((data) => {
            console.log("Response: ", data);
            //Metadata 1 IS OK
            res.json({
                success: true,
                msg: "Reserva Entregada Correctamente",
            });
        })
        .catch((e) => {
            console.log("Error: ", e);
            res.json({ success: false, msg: "Error: Reserva no procesada" });
        });
});

router.post("/reservar/eliminar", async(req, res, next) => {
    let {
        id_reserva,
    } = req.body;

    console.log("ELIMINAR RESERVA: ", req.body);

    const sqlQuery = `UPDATE Reservas  SET 
    estado_res = 'A'
    WHERE id_reserva=${id_reserva}`;

    sequelize
        .query(sqlQuery)
        .then((data) => {
            console.log("Response: ", data);
            //Metadata 1 IS OK
            res.json({
                success: true,
                msg: "Reserva Entregada Correctamente",
            });
        })
        .catch((e) => {
            console.log("Error: ", e);
            res.json({ success: false, msg: "Error: Reserva no procesada" });
        });
});
/* ----------------- INSERT ----------------- */
/* ------------------------------------------ */
//Procedmiento para insertar una reserva
router.post("/reservar", async(req, res, next) => {
    let {
        cedula_cliR,
        codigo_habR,
        cedula_empR,
        fechaReg_res,
        fechaIng_res,
        fechaSal_res,
        numDias_res,
        prcTotal_res,
        abono_res,
        saldo_res,
        estado_res,
    } = req.body;

    console.log("INSERTAR RESERVA: ", req.body);
    const sqlQuery = `INSERT INTO Reservas VALUES('${cedula_cliR}',
    '${codigo_habR}','${cedula_empR}', '${fechaReg_res}',
    '${fechaIng_res}','${fechaSal_res}','${numDias_res}',
    '${prcTotal_res}', '${abono_res}','${saldo_res}','${estado_res}')`;

    sequelize
        .query(sqlQuery)
        .then((data) => {
            console.log("Response: ", data);
            //Metadata 1 IS OK
            res.json({
                success: true,
                msg: "Reserva Registrado Correctamente",
            });
        })
        .catch((e) => {
            console.log("Error: ", e);
            res.json({ success: false, msg: "Error: Reserva no procesada" });
        });
});

module.exports = router;