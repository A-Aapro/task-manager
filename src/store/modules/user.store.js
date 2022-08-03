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
    localStorage.clear();
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
  async signInUser({ commit }, userData) {
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
      localStorage.clear();
      localStorage.setItem("user", JSON.stringify(user));
    } catch (e) {
      return new Error(e.message);
    }
    return true;
  },
  async getUsers({ commit, getters }) {
    try {
      const response = await userService.getAllUsers(getters.getIdToken);
      const users = await response;
      commit("setUsers", users);
      router.replace("UserView");
    } catch (e) {
      return e.message;
    }
  },
  logOutUser({ commit }) {
    commit("clearAll");
  },
  async deleteAccount({ getters }) {
    const payload = { userId: getters.getUserId, idToken: getters.getIdToken };
    try {
      const response = await userService.deleteAccount(payload);
      const deleteAuth = await userService.deleteAuth(payload.idToken);

      if (!response.ok || !deleteAuth.ok) {
        throw new Error("Tilin poisto epäonnistui");
      }
      return;
    } catch (e) {
      return new Error(e.message);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
