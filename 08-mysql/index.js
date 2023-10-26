const { createConnection } = require("mysql2");

const connection = createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "sf",
});
connection.query("SELECT * FROM customers", function (err, results, fields) {
  console.log(results);
  console.log(fields.map((item) => item.name));
});
