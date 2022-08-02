const getDefaultState = () => {
  return {
    loginUser: {},
    userData: [],
    token: null,
    userId: null,
    expiresIn: null,
  };
};

const state = getDefaultState();

const mutations = {
  setUserAuth(state, payload) {
    state.token = payload.token;
    state.userId = payload.userId;
    state.expiresIn = payload.expiresIn;
  },
};

const getters = {
  userId(state) {
    return state.userId;
  },
  token(state) {
    return state.token;
  },
};

const actions = {
  async createUserAuth({ commit, dispatch }, payload) {
    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" +
          process.env.VUE_APP_AUTH_KEY,
        {
          method: "POST",
          body: JSON.stringify({
            email: payload.email,
            password: payload.password,
            returnSecureToken: true,
          }),
        }
      );
      const data = await response.json();

      if (data.error) {
        throw new Error("Rekisteröinti epäonnistui");
      }
      commit("setUserAuth", {
        token: data.idToken,
        userId: data.localId,
        expiresIn: data.expiresIn,
      });
      dispatch("registerUser", {
        email: payload.email,
        userId: data.localId,
        firstname: payload.firstname,
        lastname: payload.lastname,
      });
    } catch (e) {
      return new Error(e.message);
    }
  },
  async registerUser(payload) {
    const userId = payload.userId;
    try {
      const response = await fetch(
        `https://kuuki-task-manager-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}.json`,
        {
          method: "PUT",
          body: JSON.stringify({
            userId: payload.userId,
            firstname: payload.firstname,
            lastname: payload.lastname,
            email: payload.email,
          }),
        }
      );
      if (response.error) {
        throw new Error(response.error);
      }
    } catch (e) {
      return e;
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
