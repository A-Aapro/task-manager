import { createStore } from "vuex";
import task from "./task.store.js";
import user from "./user.store.js";
import register from "./register.store.js";

const store = createStore({
  modules: {
    task,
    user,
    register,
  },
});

export default store;
