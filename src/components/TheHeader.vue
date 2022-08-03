<template>
  <div
    class="flex flex-wrap px-4 py-2 mb-3 surface-ground justify-content-between"
  >
    <div class="flex flex-wrap">
      <img src="../assets/monster.png" alt="Monster" width="50" />
      <h1 class="text-center text-700">Task Slayer</h1>
    </div>
    <!-- SUBMIT FORM -->
    <div v-if="!loggedIn">
      <div class="flex flex-wrap mt-3">
        <form class="flex flex-wrap" @submit.prevent="submitUser">
          <div class="flex ml-2 mt-3 md:mt-0">
            <my-input
              v-model.trim="email"
              id="email"
              type="text"
              placeholder="E-mail"
              class="p-inputtext-sm"
              :class="{ 'p-invalid': !userIsValid }"
            />
          </div>
          <div class="ml-2 flex mt-3 md:mt-0">
            <my-password
              v-model="password"
              :feedback="false"
              placeholder="Salasana"
              class="flex p-inputtext-sm w-10rem"
              :class="{ 'p-invalid': !userIsValid }"
              toggleMask
            />
          </div>
          <div class="ml-2 flex mt-3 md:mt-0">
            <my-button
              aria-label="Login button"
              class="p-button-sm w-5rem flex"
              type="submit"
              label="Kirjaudu"
            />
          </div>
        </form>
        <div class="ml-2 flex mt-3 md:mt-0">
          <my-button
            aria-label="Signup button"
            icon="pi pi-external-link"
            class="p-button-sm p-button-secondary w-8rem flex"
            type="button"
            label="Rekisteröidy"
            @click="showSignUp"
          ></my-button>
        </div>
      </div>
      <small for="email" v-if="!userIsValid" class="flex flex-wrap p-error ml-2"
        >Väärä e-mail tai salasana</small
      >
    </div>
  </div>
  <!-- SUBMIT FORM END -->

  <!-- REGISTER FORM -->
  <overlay-panel
    ref="op"
    class="flex flex-wrap"
    header="Rekisteröidy"
    style="width: 450px"
    appendTo="body"
    :breakpoints="{ '960px': '75vw' }"
    ><p>Rekisteröidy</p>
    <my-input
      v-model.trim="firstName"
      type="text"
      placeholder="Etunimi"
      class="p-inputtext-sm block mt-2"
      :class="{ 'p-invalid': !signUpIsValid }"
    />
    <my-input
      v-model.trim="lastName"
      type="text"
      placeholder="Sukunimi"
      class="p-inputtext-sm block mt-2"
      :class="{ 'p-invalid': !signUpIsValid }"
    />
    <my-input
      id="email"
      v-model.trim="signUpEmail"
      type="text"
      placeholder="E-mail"
      class="p-inputtext-sm block mt-2"
      :class="{ 'p-invalid': !signUpIsValid }"
    />
    <my-password
      id="password"
      v-model="signUpPassword"
      :feedback="true"
      placeholder="Salasana"
      class="p-inputtext-sm block mt-2"
      :class="{
        'p-invalid': !signUpIsValid,
      }"
      toggleMask
    ></my-password>
    <label for="password" class="block mt-2 text-xs"
      >Salasanassa oltava vähintään 6 merkkiä</label
    >

    <my-message v-if="regComplete" severity="success" :closable="false"
      >Rekisteröinti onnistui! Voit kirjautua sisään.</my-message
    >
    <my-message v-if="errorInReg" severity="error"
      >Rekisteröinti ei onnistunut</my-message
    >

    <my-button
      label="Peruuta"
      icon="pi pi-times"
      @click="closeSignUp"
      class="p-button-text mt-3"
    />
    <my-button
      aria-label="SignUp button"
      class="p-button-sm w-10rem mt-3 ml-2"
      type="button"
      icon="pi pi-check"
      label="Rekisteröidy"
      @click="signupUser"
      autofocus
    />
  </overlay-panel>

  <!--REGISTER FORM END -->
</template>

<script>
import MyPassword from "primevue/password";
import OverlayPanel from "primevue/overlaypanel";
import Message from "primevue/message";
import { mapActions } from "vuex";

export default {
  components: {
    MyPassword,
    "overlay-panel": OverlayPanel,
    "my-message": Message,
  },
  data() {
    return {
      name: "HomePage",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      userData: [],
      userIsValid: true,
      showOverlay: false,
      toggleMask: true,
      signUpPassword: "",
      signUpEmail: "",
      signUpIsValid: true,
      regComplete: false,
      errorInReg: false,
      loggedIn: false,
    };
  },
  props: { loggedOut: { type: Boolean, default: false } },
  watch: {
    loggedOut(newVal) {
      if (newVal === true) {
        this.loggedIn = false;
      } else {
        this.loggedIn = true;
      }
    },
  },
  methods: {
    ...mapActions("user", ["signInUser"]),
    ...mapActions("register", ["createUserAuth"]),

    async submitUser() {
      try {
        const response = await this.signInUser({
          email: this.email,
          password: this.password,
        });
        if (response.message) {
          this.userIsValid = false;
          return;
        }

        this.userIsValid = true;
        this.password = "";
        this.email = "";
        this.loggedIn = "true";
        this.$store.dispatch("user/getUsers");
      } catch (e) {
        console.log("Virhe", e);
        this.userIsValid = false;
      }
    },
    async signupUser() {
      this.signUpIsValid = true;
      this.errorInReg = false;
      if (
        (this.firstName || this.lastName || this.signUpEmail) === "" ||
        this.signUpPassword.length < 6
      ) {
        this.signUpIsValid = false;
        return;
      }

      if (this.signUpEmail.length > 0 && !this.signUpEmail.includes("@")) {
        this.signUpIsValid = false;
        return;
      }
      try {
        const response = await this.createUserAuth({
          firstname: this.firstName,
          lastname: this.lastName,
          email: this.signUpEmail,
          password: this.signUpPassword,
        });

        if (response) {
          this.signUpIsValid = false;
          this.errorInReg = true;
          return;
        }
      } catch (e) {
        this.signUpIsValid = false;
        (this.errorInReg = true), console.log(e);
      }

      (this.firstName = ""), (this.lastName = ""), (this.signUpPassword = "");
      this.signUpEmail = "";
      this.regComplete = true;
      this.errorInReg = false;
      setTimeout(() => {
        this.$refs.op.hide();
      }, 6000);
    },
    showSignUp(event) {
      this.$refs.op.toggle(event);
    },
    closeSignUp() {
      this.$refs.op.hide();
    },
  },
};
</script>
<style scoped>
h1 {
  font-family: "Plus Jakarta Sans", sans-serif;
  font-size: 30px;
  margin: auto 5px;
}
::v-deep(.p-password input) {
  width: 100%;
}
</style>
