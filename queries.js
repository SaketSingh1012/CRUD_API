const Pool = require("pg").Pool;
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const yup = require("yup");

const todoSchema = yup.object().shape({
  text: yup.string().required(),
  isCompleted: yup.boolean().required(),
});

// GET all todos
const getUsers = (request, response) => {
  pool.query("SELECT * FROM todos ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// GET a single todo by ID
const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM todos WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// POST a new todo
const createUser = (request, response) => {
  const { text, isCompleted } = request.body;

  todoSchema
    .validate({ text, isCompleted })
    .then(() => {
      pool.query(
        "INSERT INTO todos (text, isCompleted) VALUES ($1, $2) RETURNING *",
        [text, isCompleted],
        (error, results) => {
          if (error) {
            throw error;
          }
          response.status(201).json(results.rows[0]);
        }
      );
    })
    .catch((error) => {
      response.status(400).json({ error: error.errors[0] });
    });
};

// PUT updated data for an existing todo
const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { text, isCompleted } = request.body;

  todoSchema
    .validate({ text, isCompleted })
    .then(() => {
      pool.query(
        "UPDATE todos SET text = $1, isCompleted = $2 WHERE id = $3 RETURNING *",
        [text, isCompleted, id],
        (error, results) => {
          if (error) {
            throw error;
          }
          response.status(200).json(results.rows[0]);
        }
      );
    })
    .catch((error) => {
      response.status(400).json({ error: error.errors[0] });
    });
};

// DELETE a todo
const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM todos WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`TODO deleted with ID: ${id}`);
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};

