const STORAGE_KEY = "todos-vuejs-2.0";

export const todoStorage = {
  fetch() {
    return new Promise((resolve, reject) => {
      let todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (todos) {
        todos.forEach((todo, index) => {
          todo.id = index;
        });
        todoStorage.uid = todos.length;
        resolve(todos);
      } else {
        reject(null);
      }
    });
  },
  save(todos) {
    return new Promise((resolve, reject) => {
      const resSave = localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      console.log('resSave: ', resSave);
      // if (resSave) {
        resolve(true);
      // } else {
      //   reject(false);
      // }
    });
  }
};
