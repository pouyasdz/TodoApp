class TodoApp {
  form = document.querySelector("form");
  input = document.querySelector("#todo-input");
  todoList = document.querySelector(".todo-list");
  sesstionID = "todos";

  constructor() {
    this.read();
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.create();
    });
  }

  create() {
    const title = this.input.value;
    if (!title.replace(/\s/g, "")) return;
    let uniqueID;
    while (true) {
      uniqueID = Math.floor(Math.random() * 1000000);
      if (!this.checkID(uniqueID)) break;
    }
    const newTodo = {
      id: uniqueID,
      done: false,
      title,
    };

    window.sessionStorage.setItem(
      this.sesstionID,
      JSON.stringify([newTodo, ...this.getSessionTodos()])
    );
    this.input.value = "";
    this.read();
  }

  read() {
    this.todoList.innerHTML = null;
    const todos = this.getSessionTodos();
    todos.forEach((todo) => {
      this.todoList.innerHTML += `
        <div class="todo ${todo.done ? "todo-done" : ""}">
            <span class="checkmark ${todo.done ? "checkmark-done" : ""}" onclick='app.doneTodo("${todo.id}")'></span>
            <p>${todo.title.substring(0, 20)}${todo.title.length >= 20 ? "..." : ""}</p>
            <div class="btn-group">
              <button style="color: #f97316" onclick='app.update("${
                todo.id
              }")'>edit</button>
              /
              <button style="color: #dc2626" onclick='app.delete("${
                todo.id
              }")'>delete</button>
            </div>
          </div>
        `;
    });
  }

  update(id) {
    const todos = this.getSessionTodos();
    const todoIndex = todos.findIndex((t) => t.id == id);
    const todo = todos[todoIndex];
    this.input.value = todo.title;
    this.delete(id);
  }

  delete(id) {
    const todos = this.getSessionTodos();
    const newTodos = todos.filter((todo) => todo.id != id);
    this.setSessionTodos(newTodos);
    this.read();
  }

  checkID(id) {
    const todos = this.getSessionTodos();
    if (!todos.find((todo) => todo.id == id)) return false;
    return true;
  }

  doneTodo(id){
    const todos = this.getSessionTodos();
    const todoIndex = todos.findIndex((t) => t.id == id);
    const todo = todos[todoIndex];
    todo.done ? todo.done = false : todo.done = true;
    todos[todoIndex] = todo;
    this.setSessionTodos(todos);
    this.read();
  }

  getSessionTodos() {
    const todos = window.sessionStorage.getItem(this.sesstionID);
    if (!todos) return [];
    return [...JSON.parse(todos)];
  }

  setSessionTodos(todos = []) {
    window.sessionStorage.setItem(this.sesstionID, JSON.stringify(todos));
  }
}

const app = new TodoApp();