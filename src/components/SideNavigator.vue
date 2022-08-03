<template>
  <my-toast position="top-left" />
  <teleport to="body">
    <confirm-dialog />
  </teleport>
  <div
    class="block col-12 lg:col-2 mt-3 lg:ml-3 lg:h-full border-round"
    id="nav"
  >
    <div class="surface-card w-12 py-2 mb-3 border-round">
      <my-avatar
        :label="userInitials(user)"
        class="ml-3 p-3"
        size="small"
        :style="styleAvatar(user.userId)"
        shape="circle"
      />
      <span class="ml-3 text-white font-bold">{{ user.firstname }}</span>
    </div>
    <panel-menu :model="items" class="w-12" />
    <my-accordion>
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
              <div>
                <a class="mailto" :href="sendEmail(users.email)"
                  >.
                  <my-avatar
                    :label="users.firstname.charAt(0)"
                    class="mb-1 mr-2"
                    size="small"
                    :style="styleAvatar(users.userId)"
                    shape="circle" /></a
                >{{ users.firstname }} {{ users.lastname }}
              </div>
            </li>
          </ul>
        </div>
      </accordion-tab>
    </my-accordion>
  </div>
</template>

<script>
import PanelMenu from "primevue/panelmenu";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import Toast from "primevue/toast";

export default {
  components: {
    "my-accordion": Accordion,
    AccordionTab,
    PanelMenu,
    "my-toast": Toast,
  },
  data() {
    return {
      items: [
        {
          label: "Tili",
          icon: "pi pi-fw pi-user",
          items: [
            {
              label: "Poista tili",
              icon: "pi pi-fw pi-trash",
              command: () => {
                this.deleteAccount();
              },
            },
            {
              label: "Kirjaudu ulos",
              icon: "pi pi-fw pi-sign-out",
              command: () => {
                this.loggingOut();
              },
            },
          ],
        },
        {
          label: "Slay-a-Monster",
          icon: "pi pi-fw pi-heart",
          command: () => {
            this.$emit("toggleGame");
          },
        },
      ],
    };
  },
  emits: ["toggleGame", "logOut"],

  computed: {
    user() {
      return this.$store.getters["user/getUser"];
    },
    users() {
      return this.$store.getters["user/getUsers"];
    },
    userName() {
      return this.$store.getters["user/getFullName"];
    },
  },
  methods: {
    userInitials(user) {
      return user.firstname.charAt(0) + user.lastname.charAt(0);
    },
    sendEmail(email) {
      return "mailto:" + email;
    },
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
      this.$store.dispatch("user/logOutUser");
      this.$store.dispatch("task/logOut");
      this.$emit("logOut", true);
    },
    async deleteAccount() {
      this.$confirm.require({
        message:
          "Haluatko poistaa tilisi? Poistaminen kadottaa kaikki tehtäväsi ja tietosi.",
        header: "Poista tili",
        icon: "pi pi-info-circle",
        acceptClass: "p-button-danger",
        accept: () => {
          this.confirmedDelete();
          this.$confirm.close();
          this.loggingOut();
        },
        reject: () => {
          this.$confirm.close();
        },
      });
    },
    async confirmedDelete() {
      try {
        const response = await this.$store.dispatch("user/deleteAccount");
        console.log(response);
        if (response) {
          throw new Error(response);
        }
        this.showSuccess();
      } catch (e) {
        this.showWarning();
        console.log(e);
      }
    },
    showSuccess() {
      this.$toast.add({
        severity: "success",
        summary: "Onnistui!",
        detail: "Tilisi on nyt poistettu",
        life: 6000,
      });
    },
    showWarning() {
      this.$toast.add({
        severity: "warning",
        summary: "Jotain meni vikaan",
        detail:
          "Tilin poisto epäonnistui. Yritä uudelleen tai ota yhteyttä ylläpitoon.",
        life: 6000,
      });
    },
  },
};
</script>

<style scoped>
div {
  font-size: 14px;
}
.p-panelmenu {
  width: 15vw;
}
a {
  color: transparent;
}
.p-avatar {
  font-size: 16px;
  width: 35px;
  height: 35px;
}
</style>
