const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");
const yup = require("yup");
dotenv.config();

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
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

const handleError = (response, error) => {
  console.error("Error:", error);
  response.status(500).json({ error: error.message });
};

const todoSchema = yup.object().shape({
  text: yup.string().required(),
  isCompleted: yup.boolean().required(),
});

const validateTodo = async (data, response) => {
  try {
    await todoSchema.validate(data, { abortEarly: false });
  } catch (error) {
    response.status(400).json({ error: error.errors[0] });
    throw error; // Throw the error to stop further processing
  }
};

const getUsers = async (request, response) => {
  try {
    const todos = await Todo.findAll();
    response.status(200).json(todos);
  } catch (error) {
    handleError(response, error);
  }
};

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
    handleError(response, error);
  }
};

const createUser = async (request, response) => {
  const { text, isCompleted } = request.body;

  try {
    await validateTodo({ text, isCompleted }, response);
    const todo = await Todo.create({ text, isCompleted });
    response.status(201).json(todo);
  } catch (error) {
    handleError(response, error);
  }
};

const updateUser = async (request, response) => {
  const id = parseInt(request.params.id);
  const { text, isCompleted } = request.body;

  try {
    await validateTodo({ text, isCompleted }, response);
    const todo = await Todo.findByPk(id);
    if (todo) {
      await todo.update({ text, isCompleted });
      response.status(200).json(todo);
    } else {
      response.status(404).json({ message: "Todo not found" });
    }
  } catch (error) {
    handleError(response, error);
  }
};

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
    handleError(response, error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};