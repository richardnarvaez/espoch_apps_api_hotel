# API SIMPLE RESERVA HOTELES | NODEJS

> App HOTEL

## Change connection.js

```js
const sequelize = new Sequelize("database", "username", "pass", {
  host: "localhost",
  dialect: "mssql",
  dialectOptions: {
    options: {
      validateBulkLoadParameters: true,
    },
  },
});
```

## Install dependencias

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install
```

## Init

```sh
$ npm run dev
```

## Localhost

Go to [localhost](http://localhost:4000)

### License

Copyright © 2021, [Richard Narvaez](https://github.com/richardnarvaez).
Released under the [MIT License](LICENSE).

---

_v0.6.0, on Jan 8, 2021._
