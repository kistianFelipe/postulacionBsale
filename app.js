const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));

const pool = mysql.createPool({
  connectionLimit: 50,
  host: "mdb-test.c6vunyturrl6.us-west-1.rds.amazonaws.com",
  user: "bsale_test",
  password: "bsale_test",
  database: "bsale_test",
});

//inicia mysql
const connection = mysql.createConnection({
  host: "mdb-test.c6vunyturrl6.us-west-1.rds.amazonaws.com",
  user: "bsale_test",
  password: "bsale_test",
  database: "bsale_test",
});

app.listen(PORT, () => console.log(`connected on ${PORT}`));

//ROUTES
//index
app.get("/", (req, res) => {
  res.send("BIENVENIDO");
});

//products by name
app.get("/products/:name", (req, res) => {
  let sql = `Select * from product where name like '%${req.params.name}%'`;
  if (req.params.name.toUpperCase() === "ALL") sql = `Select * from product`;
  fetchData(sql, req, res);
});

//products by category
app.get("/productsByCategory/:id", (req, res) => {
  let sql = `Select * from product where category = ${req.params.id}`;
  fetchData(sql, req, res);
});

//categories
app.get("/categories", (req, res) => {
  const sql = `Select * from category`;
  fetchData(sql, req, res);
});

//fetch data from  mysql
const fetchData = (sql, req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.changeUser({ database: "bsale_test" });
    connection.query(sql, (err, data) => {
      connection.release();
      if (data && data.length > 0) {
        return res.status(200).send(data);
      } else return res.status(200).json({});
    });
  });
};
