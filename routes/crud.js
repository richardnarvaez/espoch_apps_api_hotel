var express = require("express");
const sequelize = require("../connection");
var router = express.Router({ mergeParams: true });

var messageError = {
  error: {
    code: "400",
    message: "Invalid request - exemplo: ?t=nametable",
  },
};

router.get("/hola/:id?", async (req, res, next) => {
  console.log("REQUEST: ", req.params);
  console.log("REQUEST: ", req.query);
  if (req.query.t === undefined) {
    res.json(messageError);
    return;
  }
  if (req.params.id) {
    console.log("Existe ID");
    const [results, metadata] = await sequelize.query(
      "SELECT * FROM estudiantes"
    );
    console.log(results);
    //   crud.getById(req.params.id, req.query.t, function (err, rows) {
    //     if (err)
    //         res.json(err);
    //         res.json(rows);
    // });
    res.json(results);
  } else {
    res.json({ hola: "paramentro no encontrado" });
  }
});

router.get("/students", async (req, res, next) => {
  console.log("REQUEST: ", req.params);
  console.log("REQUEST: ", req.query);

  console.log("Existe ID");
  const [results, metadata] = await sequelize.query(
    "SELECT * FROM estudiantes"
  );
  res.json(results);
});

router.get("/docentes", async (req, res, next) => {
  console.log("REQUEST: ", req.params);
  console.log("REQUEST: ", req.query);
  const [results] = await sequelize.query("SELECT * FROM docentes");
  res.json(results);
});

module.exports = router;
