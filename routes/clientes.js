var express = require("express");
const { QueryTypes } = require("sequelize");
const sequelize = require("../connection");
var router = express.Router({ mergeParams: true });

/* ------------------- ALL ------------------ */
/*   ------------------------------------------ */
router.get("/clientes", async(req, res, next) => {
    const [results] = await sequelize.query("SELECT * FROM Clientes");
    res.json(results);
});

/* ----------------- FILTER ----------------- */
/* ------------------------------------------ */
//Procedimiento para buscar uncliente por cedula
router.get("/clientes/filter?", async(req, res, next) => {
    const { cedula } = req.query;
    try {
        const [results] = await sequelize.query(
            "SELECT * FROM Clientes WHERE  cedula_cli Like '" + cedula + "%';"
        );
        res.json(results);
    } catch (e) {
        console.log(e)
        res.json({ success: false, msg: "Error al consultar, intentelo otra vez" });
    }

});

function validaCedula(cedula) {
    // Control de provincia entre 1 y 24
    lv_prov = Number(cedula.substring(0, 2));
    if (lv_prov >= 1 && lv_prov <= 24) {
        lv_numced = cedula;
        ll_TenDig = Number(cedula.substring(9, 10));
        ll_sum = 0;
        ll_Cnt = 0;
        ll_CntPos = 0;
        while (ll_CntPos < 9) {
            ll_CntPos = 2 * ll_Cnt + 1;
            lv_StrNum = lv_numced.substring(ll_CntPos - 1, ll_CntPos);
            ll_multi = Number(lv_StrNum) * 2;
            if (ll_multi >= 10) ll_multi = 1 + (ll_multi % 10);
            ll_sum += ll_multi;
            ll_Cnt += 1;
        }
        ll_Cnt = 1;
        ll_CntPos = 1;
        while (ll_CntPos < 8) {
            ll_CntPos = 2 * ll_Cnt;
            lv_StrNum = lv_numced.substring(ll_CntPos - 1, ll_CntPos);
            ll_sum += Number(lv_StrNum);
            ll_Cnt += 1;
        }
        ll_cociente = Math.floor(ll_sum / 10);
        ll_decena = (ll_cociente + 1) * 10;
        ll_verificador = ll_decena - ll_sum;
        if (ll_verificador == 10) ll_verificador = 0;
        if (ll_verificador == ll_TenDig) return true;
        else return false;
    } else {
        return false;
    }
}

/* -----   ------------ INSERT ----------------- */
/* ----- ------------------------------------- */
//proced imiento para insertar un cliente
router.post("/cliente", async(req, res, next) => {
    let {
        cedula_cli,
        nombre_cli,
        apellido_cli,
        direccion_cli,
        telefono_cli,
    } = req.body;

    if (!validaCedula(cedula_cli)) {
        res.json({ success: false, msg: "Error: Cedula Incorrecta" });
        return
    }

    console.log("INSERT CLIENTE: " + req.body);

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
            console.log(e);
            res.json({ success: false, msg: "Error: El Cliente Ya Existe" });
        });
});

module.exports = router;