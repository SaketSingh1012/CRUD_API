#                                              Express HTTP CRUD API

## Clone the Repository
```bash
  git clone https://github.com/SaketSingh1012/CRUD_API.git
  npm install
  ```
## Configure Environment Variables
## Create a .env file in the root directory of the project and add the following configuration:

* .env
```bash
DB_USER=todos
DB_HOST=localhost
DB_DATABASE=api
DB_PASSWORD=123
DB_PORT=3000  
```
* Make sure to replace the values with your desired database credentials.

Run the Project
```bash
node index.js
```
- The app will run on http://localhost:3000.

## API Endpoints
- GET /todos: Retrieve all todos.
- GET /todos/:id: Retrieve a single todo by ID.
- POST /todos: Create a new todo.
- PUT /todos/:id: Update an existing todo.
- DELETE /todos/:id: Delete a todo by ID.
