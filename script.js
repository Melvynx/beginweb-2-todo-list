const addTodoEl = document.querySelector("#add-todo");
const listEl = document.querySelector("#list");

addTodoEl.addEventListener("click", (e) => {
  e.preventDefault();
  const newId = Date.now();
  const newTodos = [
    ...appState.todos.filter((t) => !t.completed),
    {
      id: newId,
      text: `untitled ${appState.todos.length + 1}`,
      completed: false,
    },
    ...appState.todos.filter((t) => t.completed),
  ];
  setTimeout(() => {
    const todoEl = document.querySelector(`[data-todo-id="${newId}"]`);
    console.log(todoEl);
    todoEl.querySelector(".todo-text").click();
    setTimeout(() => {
      const inputEl = todoEl.querySelector('input[type="text"]');
      inputEl.focus();
      inputEl.select();
    }, 50);
  }, 50);
  updateTodos(newTodos);
});

const appState = {
  todos: [],
};

appState.todos = JSON.parse(localStorage.getItem("todos")) || [];

const updateTodos = (newTodos) => {
  appState.todos = newTodos;
  localStorage.setItem("todos", JSON.stringify(newTodos));
  renderTodos();
};

const renderTodos = () => {
  document.startViewTransition(() => {
    listEl.innerHTML = "";

    for (const todo of appState.todos) {
      createTodo(todo);
    }
    lucide.createIcons();
  });
};

const createTodo = (todo) => {
  const todoEl = document.createElement("div");
  todoEl.classList.add("todo");
  todoEl.style["view-transition-name"] = `todo-${todo.id}`;
  todoEl.setAttribute("data-todo-id", todo.id);
  if (todo.completed) {
    todoEl.classList.add("checked");
  }

  const checkboxEl = createCheckbox(todo);
  const textEl = createTextElement(todo);
  const inputEl = createInputElement(todo, textEl);
  const deleteEl = createDeleteButton(todo);

  todoEl.appendChild(checkboxEl);
  todoEl.appendChild(textEl);
  todoEl.appendChild(inputEl);
  todoEl.appendChild(deleteEl);

  listEl.appendChild(todoEl);
};

const createCheckbox = (todo) => {
  const checkboxEl = document.createElement("div");
  checkboxEl.classList.add("todo-checkbox");

  const filledEl = document.createElement("div");
  filledEl.classList.add("todo-checkbox-circle");

  const checkboxInputEl = document.createElement("input");
  checkboxInputEl.type = "checkbox";
  checkboxInputEl.checked = todo.completed;
  checkboxInputEl.addEventListener("change", () => {
    const newTodos = appState.todos.filter((t) => t.id !== todo.id);
    const updatedTodo = { ...todo, completed: checkboxInputEl.checked };

    if (updatedTodo.completed) {
      newTodos.push(updatedTodo);
    } else {
      const lastCheckedIndex = newTodos.findIndex((t) => t.completed);
      if (lastCheckedIndex === -1) {
        newTodos.push(updatedTodo);
      } else {
        newTodos.splice(lastCheckedIndex, 0, updatedTodo);
      }
    }
    updateTodos(newTodos);
  });

  checkboxEl.appendChild(checkboxInputEl);
  checkboxEl.appendChild(filledEl);

  return checkboxEl;
};

const createTextElement = (todo) => {
  const textEl = document.createElement("p");
  textEl.classList.add("todo-text");
  textEl.textContent = todo.text;
  return textEl;
};

const createInputElement = (todo, textEl) => {
  const inputEl = document.createElement("input");
  inputEl.type = "text";
  inputEl.value = todo.text;
  inputEl.style.display = "none";
  inputEl.classList.add("todo-text");

  inputEl.addEventListener("blur", () => {
    todo.text = inputEl.value;
    const newTodos = appState.todos.map((t) =>
      t.id === todo.id ? { ...t, text: inputEl.value } : t
    );
    updateTodos(newTodos);
    renderTodos();
  });

  inputEl.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      inputEl.blur();
    }
  });

  textEl.addEventListener("click", () => {
    inputEl.style.display = "block";
    textEl.style.display = "none";
    inputEl.focus();
  });

  return inputEl;
};

const createDeleteButton = (todo) => {
  const deleteEl = document.createElement("button");
  deleteEl.classList.add("todo-delete");
  deleteEl.innerHTML = "<i data-lucide='trash'></i>";

  deleteEl.addEventListener("click", () => {
    const newTodos = appState.todos.filter((t) => t.id !== todo.id);
    updateTodos(newTodos);
  });

  return deleteEl;
};

renderTodos();

const backgroundSelectorEl = document.querySelector(".background-selector");

const savedBackgroundImage = localStorage.getItem("background-image");
if (savedBackgroundImage) {
  document.body.style.backgroundImage = savedBackgroundImage;
}

backgroundSelectorEl.addEventListener("click", (e) => {
  console.log("Click", e.target.style.backgroundImage);
  if (e.target.classList.contains("background-selector-item")) {
    document.body.style.backgroundImage = `${e.target.style.backgroundImage}`;
    localStorage.setItem("background-image", e.target.style.backgroundImage);
  }
});
