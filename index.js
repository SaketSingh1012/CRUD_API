const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./queries");
const port = process.env.DB_PORT||3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.get("/todos", db.getUsers);
app.get("/todos/:id", db.getUserById);
app.post("/todos", db.createUser);
app.put("/todos/:id", db.updateUser);
app.delete("/todos/:id", db.deleteUser);

app.listen(port, () => {
  console.log(`App running on port http://localhost:${port}.`);
});
