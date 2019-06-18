<template>
  <div class="toDo">
    <section class="todoapp">
      <header class="header">
        <h1>todos</h1>
        <input
          type="text"
          autofocus
          autocomplete="off"
          class="new-todo"
          placeholder="What needs to be done?"
          v-model="newTodo"
          @keyup.enter="addTodo"
        >
      </header>
      <section class="main" v-show="todos.length" v-cloak>
        <input type="checkbox" id="toggle-all" class="toggle-all" v-model="allDone">
        <label for="toggle-all"></label>
        <ul class="todo-list">
          <li
            v-for="todo in filteredTodos"
            :key="todo.id"
            class="todo"
            :class="{ completed: todo.completed, editing: todo === editedTodo }"
          >
            <div class="view">
              <input type="checkbox" v-model="todo.completed" class="toggle">
              <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
              <button class="destroy" @click="removeTodo(todo)"></button>
            </div>
            <input
              type="text"
              class="edit"
              v-model="todo.title"
              v-todo-focus="todo === editedTodo"
              @blur="doneEdit(todo)"
              @keyup.enter="doneEdit(todo)"
              @keyup.esc="cancelEdit(todo)"
            >
          </li>
        </ul>
      </section>
      <footer class="footer" v-show="todos.length" v-cloak>
        <span class="todo-count">
          <strong>{{ remaining }}</strong>
          {{ remaining | pluralize }} left
        </span>
        <ul class="filters">
          <li>
            <a @click="changeVisibility('all')" :class="{selected : visibility === 'all'}">All</a>
          </li>
          <li>
            <a
              @click="changeVisibility('active')"
              :class="{selected : visibility === 'active'}"
            >Active</a>
          </li>
          <li>
            <a
              @click="changeVisibility('completed')"
              :class="{selected : visibility === 'completed'}"
            >Completed</a>
          </li>
        </ul>
        <button
          class="clear-completed"
          @click="removeCompleted"
          v-show="todos.length > remaining"
        >Clear completed</button>
      </footer>
    </section>
    <footer class="info">
      <p>Double-click to edit a todo</p>
      <p>
        Written by
        <a href="http://www.albertomasia.it">Alberto Masia</a>
      </p>
      <p>
        Inspired by
        <a href="http://todomvc.com">TodoMVC</a>
      </p>
    </footer>
  </div>
</template>
<script>
import { filters } from "../filters.js";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      newTodo: "",
      editedTodo: null,
      visibility: "all"
    };
  },
  computed: {
    todos() {
      return this.$store.getters["todos"];
    },
    filteredTodos() {
      return filters[this.visibility](this.todos);
    },
    remaining() {
      return filters.active(this.todos).length;
    },
    allDone: {
      get() {
        return this.remaining === 0;
      },
      set(value) {
        this.todos.forEach(todo => {
          todo.completed = value;
        });
      }
    }
  },
  filters: {
    pluralize(n) {
      return n === 1 ? "item" : "items";
    }
  },
  watch: {
    todos: {
      handler(todos) {
        console.log("todos changed: ", todos);
        this.$store.dispatch("saveTodos", todos);
      },
      deep: true
    }
  },
  methods: {
    ...mapActions({
      fetchData: "loadData"
    }),
    addTodo() {
      let value = this.newTodo && this.newTodo.trim();
      if (!value) {
        return;
      }
      this.todos.push({
        title: value,
        completed: false
      });
      this.newTodo = "";
    },
    removeTodo(todo) {
      const index = this.todos.indexOf(todo);
      this.todos.splice(index, 1);
    },
    editTodo(todo) {
      this.beforeEditCache = todo.title;
      this.editedTodo = todo;
    },
    doneEdit(todo) {
      if (!this.editedTodo) {
        return;
      }
      this.editedTodo = null;
      todo.title = todo.title.trim();
      if (!todo.title) {
        this.removeTodo(todo);
      }
    },
    cancelEdit(todo) {
      this.editedTodo = null;
      todo.title = this.beforeEditCache;
    },
    removeCompleted() {
      filters.completed(this.todos).forEach(this.removeTodo);
    },
    changeVisibility(visibility) {
      this.visibility = visibility;
    },
    loadData() {
      // CAUTION HERE:
      // this is a mapped action so I can call it
      // like an internal method just writing:
      // this.fetchData();

      // without mapped actions I could have had
      // something like this, with the same result:
      this.$store.dispatch("fetchTodos");
    }
  },
  directives: {
    "todo-focus": function(el, binding) {
      if (binding.value) {
        el.focus();
      }
    }
  },
  created() {
    this.loadData();
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/toDo";
</style>
