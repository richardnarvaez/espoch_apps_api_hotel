const { Sequelize } = require("sequelize");
//  db_base_datos_1 'SA_PASSWORD=BaseDatos1234567890' -p 1433:1433
// const sequelize = new Sequelize(
//   "mssql://localhost:1433;user=SA;password=BaseDatos1234567890"
// );

// const sequelize = new Sequelize("academico", "SA", "BaseDatos1234567890", {
//   host: "localhost",
//   dialect: "mssql",
//   dialectOptions: {
//     options: { 
//       validateBulkLoadParameters: true,
//     },
//   },
// });

const sequelize = new Sequelize("ProyectoHotel", "andresadmin", "p@ssw0rd", {
    host: "serverandres.database.windows.net",
    dialect: "mssql",
    dialectOptions: {
        options: {
            validateBulkLoadParameters: true,
        },
    },
});



auth = async() => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

auth();

module.exports = sequelize;