import router from "@/router";
import { userService } from "@/services";

const getDefaultState = () => {
  return {
    users: [],
    user: {},
    localId: "",
    idToken: "",
  };
};

const state = getDefaultState();

const mutations = {
  setUsers(state, payload) {
    let users = [];
    if (payload === null) {
      console.log("No tasks yet");
    } else {
      Object.values(payload).forEach((task) => users.push(task));
      state.users = users;
    }
  },
  setLocalId(state, payload) {
    state.localId = payload;
  },
  setIdToken(state, payload) {
    state.idToken = payload;
  },
  setUser(state, payload) {
    state.user = payload;
  },
  clearAll(state) {
    state.user = {};
    state.users = [];
    state.localId = "";
    state.idToken = "";
    router.replace("/");
  },
};

const getters = {
  getUsers() {
    return state.users;
  },
  getUser() {
    return state.user;
  },
  getUserId() {
    return state.user.userId;
  },
  getIdToken() {
    return state.idToken;
  },
  getFullName() {
    return state.user.firstname + " " + state.user.lastname;
  },
};

const actions = {
  async signInUser({ commit, dispatch }, userData) {
    try {
      const response = await userService.userAuth(userData);

      const data = await response;
      if (data.message) {
        throw new Error(data.message);
      }

      commit("setLocalId", data.localId);
      commit("setIdToken", data.idToken);

      const user = await userService.getUserData(data.localId, data.idToken);

      commit("setUser", user);
      dispatch("getUsers");
      localStorage.clear();
      localStorage.setItem("user", JSON.stringify(user));
    } catch (e) {
      return new Error(e.message);
    }
    router.replace("/UserView");
    return true;
  },
  async getUsers({ commit, getters }) {
    try {
      const response = await userService.getAllUsers(getters.getIdToken);
      const users = await response;
      commit("setUsers", users);
    } catch (e) {
      return e.message;
    }
  },
  logOutUser({ commit }) {
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
