import { taskService } from "@/services";

const getDefaultState = () => {
  return {
    tasks: [],
  };
};

const state = getDefaultState();

const mutations = {
  async setTasks(state, payload) {
    let tasks = [];
    const tasklist = payload[0];
    const userId = payload[1];
    if (tasklist === null) {
      console.log("No tasks yet");
    } else {
      Object.values(tasklist).forEach((task) => {
        if (task.users.some((user) => user.userId === userId)) {
          tasks.push(task);
        }
      });
      state.tasks = tasks;
    }
  },
  addNewTask(state, payload) {
    state.tasks.push(payload);
  },
  removeTask(state, payload) {
    state.tasks = state.tasks.filter((t) => t.taskId != payload);
  },
  updateTask(state, i, payload) {
    state.tasks[i] = payload;
  },
  clearAll(state) {
    state.tasks = [];
  },
};

const getters = {
  getTasks(state) {
    return state.tasks;
  },
};

const actions = {
  async getTasks({ commit }, payload) {
    try {
      const tasks = await taskService.getAllTasks(payload.idToken);
      commit("setTasks", [tasks, payload.userId]);
    } catch (e) {
      console.error(e);
    }
  },

  async addTask({ dispatch }, payload) {
    taskService
      .postTask(payload)
      .then(() => {
        dispatch("getTasks", payload);
      })
      .catch((error) => {
        console.error(error);
      });
  },

  async deleteTask({ dispatch }, payload) {
    taskService
      .deleteTask(payload)
      .then(() => {
        dispatch("getTasks", payload);
      })
      .catch((error) => {
        console.error(error);
      });
  },

  async editTask({ dispatch }, payload) {
    taskService
      .updateTask(payload)
      .then(() => {
        dispatch("getTasks", payload);
      })
      .catch((error) => {
        console.error(error);
      });
  },
  logOut({ commit }) {
    commit("clearAll");
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
