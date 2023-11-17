const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  logging: false,
});

const Todo = sequelize.define(
  "crud_todo",
  {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: "crud_todo",
  }
);

// Create the table if it does not exist
Todo.sync()
  .then(() => {
    console.log("crud_todo table created (if not existed)");
  })
  .catch((error) => {
    console.error("Error creating crud_todo table:", error);
  });

// GET all todos
const getUsers = async (request, response) => {
  try {
    const todos = await Todo.findAll();
    response.status(200).json(todos);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

// GET a single todo by ID
const getUserById = async (request, response) => {
  const id = parseInt(request.params.id);

  try {
    const todo = await Todo.findByPk(id);
    if (todo) {
      response.status(200).json(todo);
    } else {
      response.status(404).json({ message: "Todo not found" });
    }
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

// POST a new todo
const createUser = async (request, response) => {
  const { text, isCompleted } = request.body;

  try {
    const todo = await Todo.create({ text, isCompleted });
    response.status(201).json(todo);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
};

// PUT updated data for an existing todo
const updateUser = async (request, response) => {
  const id = parseInt(request.params.id);
  const { text, isCompleted } = request.body;

  try {
    const todo = await Todo.findByPk(id);
    if (todo) {
      await todo.update({ text, isCompleted });
      response.status(200).json(todo);
    } else {
      response.status(404).json({ message: "Todo not found" });
    }
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
};

// DELETE a todo
const deleteUser = async (request, response) => {
  const id = parseInt(request.params.id);

  try {
    const todo = await Todo.findByPk(id);
    if (todo) {
      await todo.destroy();
      response.status(200).send(`TODO deleted with ID: ${id}`);
    } else {
      response.status(404).json({ message: "Todo not found" });
    }
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};