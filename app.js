const express = require('express');
const app = express();
const port = 8080;
const productRoutes = require('./src/routes/productsRoutes');
const cartRoutes = require('./src/routes/cartRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () =>
  console.log(`Server listening on http://localhost:${port}!`)
);

app.use("/products",productRoutes);
app.use("/cart",cartRoutes);

module.exports = app;
