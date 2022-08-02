<template>
  <div
    class="block col-12 lg:col-2 mt-3 lg:ml-3 lg:h-full border-round"
    id="nav"
  >
    <my-accordion>
      <accordion-tab>
        <template #header>
          <my-avatar
            :label="user.firstname.charAt(0)"
            class="mr-2 py-0"
            size="small"
            :style="styleAvatar(user.userId)"
            shape="circle"
          />
          <span>{{ user.firstname }}</span>
        </template>
        <div class="cursor-pointer" @click="loggingOut">
          <i class="pi pi-sign-out ml-2"></i>
          <span class="ml-3">Kirjaudu ulos</span>
        </div>
      </accordion-tab>
      <accordion-tab>
        <template #header>
          <i class="pi pi-heart ml-2"></i>
          <span class="ml-3">Slay-A-Monster</span>
        </template>
        <div class="cursor-pointer" @click="$emit('toggleGame')">
          <i class="pi pi-heart-fill ml-2"></i>
          <span class="ml-3">Pelaa</span>
        </div>
      </accordion-tab>
      <accordion-tab>
        <template #header>
          <i class="pi pi-user ml-2"></i>
          <span class="ml-3">Käyttäjät</span>
        </template>
        <div>
          <ul
            v-for="users in this.users"
            :key="users.id"
            :to="users.firstname"
            class="no-underline pl-0"
          >
            <li class="list-none pl-0">
              <my-avatar
                :label="users.firstname.charAt(0)"
                class="mb-1 mr-2"
                size="small"
                :style="styleAvatar(users.userId)"
                shape="circle"
              />{{ users.firstname }} {{ users.lastname }}
            </li>
          </ul>
        </div>
      </accordion-tab>
    </my-accordion>
  </div>
</template>

<script>
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";

export default {
  components: {
    "my-accordion": Accordion,
    AccordionTab,
  },
  emits: ["toggleGame", "logOut"],

  computed: {
    user() {
      return this.$store.getters["user/getUser"];
    },
    users() {
      return this.$store.getters["user/getUsers"];
    },
  },
  methods: {
    styleAvatar(user) {
      //Generoi avatarin taustavärin käyttäjänimestä
      //Koodi googlattu täältä:
      //https://dev.to/admitkard/auto-generate-avatar-colors-randomly-138j

      const hRange = [0, 360];
      const sRange = [30, 90];
      const lRange = [30, 50];

      const getHashOfString = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        hash = Math.abs(hash);
        return hash;
      };

      const normalizeHash = (hash, min, max) => {
        return Math.floor((hash % (max - min)) + min);
      };
      let hslColor = (str) => {
        const hash = getHashOfString(str);
        const h = normalizeHash(hash, hRange[0], hRange[1]);
        const s = normalizeHash(hash, sRange[0], sRange[1]);
        const l = normalizeHash(hash, lRange[0], lRange[1]);
        return [h, s, l];
      };

      let hsl = hslColor(user);
      let colorStr = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
      return "background-color: " + colorStr + "; " + "color: #ffffff";
    },
    loggingOut() {
      localStorage.clear();
      this.$store.dispatch("user/logOutUser");
      this.$store.dispatch("task/logOut");
      this.$emit("logOut", true);
    },
  },
};
</script>

<style scoped>
div {
  font-size: 14px;
}

.p-avatar {
  font-size: 16px;
  width: 35px;
  height: 35px;
}
</style>
