<template>
  <the-header :key="refresh" :logged-out="loggedOut"></the-header>
  <div class="col-12 h-screen">
    <router-view @log-out="logOut"></router-view>
  </div>
</template>

<script>
import TheHeader from "./components/TheHeader.vue";

export default {
  name: "App",
  components: {
    TheHeader,
  },
  data() {
    return {
      loggedOut: false,
      refresh: 0,
    };
  },
  methods: {
    logOut(newVal) {
      this.loggedOut = newVal;
      this.refresh++;
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans&display=swap");

html {
  box-sizing: border-box;
}
* {
  box-sizing: inherit;
  font-family: "Roboto", sans-serif;
}
body {
  background-color: var(--surface-ground);
}
.routerlink {
  color: white;
  font-size: 14px;
}
.p-card-body .p-card-content {
  padding: 2px;
}
</style>
