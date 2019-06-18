import { todoStorage } from '../../data/localStorage';

const state = {
  todos: []
};

const mutations = {
  'SET_TODOS'(state, todos) {
    // console.log('chiamata mutation SET_TODOS', todos);
    state.todos = todos;
  }
};

const actions = {
  fetchTodos: ({ commit }) => {
    todoStorage
      .fetch()
      .then(data => {
        commit('SET_TODOS', data);
      })
      .catch(console.log);
  },
  saveTodos: ({ commit }, todos) => {
    // console.log('dispatch saveTodos:', todos);
    todoStorage
      .save(todos)
      .then(res => {
        // console.log('risultato del salvataggio dei todo nel LS: ', res);
        if (res) {
          // console.log('va qui dentro ', res);
          commit('SET_TODOS', todos);
        }
      })
      .catch(err => {
        console.log('errore nel salvataggio dei todos: ', err)
      });
  }
};

const getters = {
  todos: state => state.todos
};

export default { state, mutations, actions, getters };
