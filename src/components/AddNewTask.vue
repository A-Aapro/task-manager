<template>
  <my-button
    class="p-button-success hover:shadow-4"
    icon="pi pi-plus-circle"
    label="Lisää uusi"
    @click="toggle"
    aria:haspopup="true"
    aria-controls="overlay_panel"
  />
  <teleport to="body">
    <overlay-panel
      ref="op"
      id="overlay_panel"
      appendTo="body"
      :breakpoints="{ '470px': '90vw' }"
      :style="{ width: '350px' }"
    >
      <form class="block" @submit.prevent="addNewTask">
        <div class="mt-0">
          <my-input
            class="block mb-1"
            :required="!title"
            v-model="title"
            type="text"
            maxlength="50"
            placeholder="Lisää otsikko"
          />
          <text-area
            class="block mb-1"
            v-model="areaValue"
            :autoResize="false"
            rows="5"
            cols="30"
            maxlength="500"
            placeholder="Lisää kuvaus"
          />
          <multi-select
            class="mb-1"
            v-model="selectedUsers"
            :options="getUsers"
            :filter="true"
            placeholder="Lisää käyttäjä"
            optionLabel="name"
            display="chip"
          />
        </div>
        <div class="block mt-0 p-2">
          <div class="field-radiobutton mb-1">
            <radio-button
              :required="!tag"
              id="tag1"
              name="tag"
              value="Normaali"
              v-model="tag"
            />
            <label for="tag1" class="text-xs">Normaali</label>
          </div>
          <div class="field-radiobutton mb-1">
            <radio-button
              :required="!tag"
              id="tag2"
              name="tag"
              value="Tärkeä"
              v-model="tag"
            />
            <label for="tag2" class="text-xs">Tärkeä</label>
          </div>
          <div class="field-radiobutton mb-1">
            <radio-button
              :required="!tag"
              id="tag3"
              name="tag"
              value="Kesken"
              v-model="tag"
            />
            <label for="tag3" class="text-xs">Kesken</label>
          </div>
          <div class="field-radiobutton mb-1">
            <radio-button
              :required="!tag"
              id="tag4"
              name="tag"
              value="Tehty"
              v-model="tag"
            />
            <label for="tag4" class="text-xs">Tehty</label>
          </div>

          <div>
            <my-calendar
              id="dateformat"
              :minDate="minDateValue"
              :showIcon="true"
              v-model="dueDate"
              dateFormat="dd.mm.yy"
              placeholder="Määräaika"
              :required="!dueDate"
            />
          </div>
          <div class="flex flex-wrap justify-content-between">
            <my-button
              @click="toggle"
              label="Peruuta"
              icon="pi pi-times"
              iconPos="left"
              class="block p-button-secondary p-button-sm p-button-outlined mt-3"
            />
            <my-button
              type="submit"
              label="Tallenna"
              icon="pi pi-check"
              iconPos="left"
              class="block p-button-success p-button-sm sm:ml-2 mt-3"
            />
          </div>
        </div>
      </form>
    </overlay-panel>
  </teleport>
</template>

<script>
import OverlayPanel from "primevue/overlaypanel";
import TextArea from "primevue/textarea";
import MyCalendar from "primevue/calendar";
import MultiSelect from "primevue/multiselect";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    OverlayPanel,
    TextArea,
    MyCalendar,
    MultiSelect,
  },
  emits: ["reloadTasks"],
  data() {
    return {
      users: [],
      title: "",
      areaValue: "",
      tag: "",
      dueDate: "",
      selectedUsers: [],
      userList: [],
    };
  },
  computed: {
    ...mapGetters("user", ["getUserId"]),
    getUsers() {
      const users = this.$store.getters["user/getUsers"];
      users.forEach((user) => {
        if (user.userId !== this.getUserId) {
          let userObj = {
            name: user.firstname + " " + user.lastname,
            code: user.userId,
            email: user.email,
          };
          this.userList.push(userObj);
        }
      });
      return this.userList;
    },
    minDateValue() {
      return new Date();
    },
  },
  methods: {
    ...mapActions("task", ["addTask"]),
    toggle(event) {
      this.title = "";
      this.areaValue = "";
      this.selectedUsers = [];
      (this.dueData = ""), this.$refs.op.toggle(event);
    },
    checkForm() {
      if (this.title && this.tag && this.dueDate) {
        return true;
      }
    },
    addNewTask() {
      if (this.checkForm()) {
        let month = this.dueDate.getMonth() + 1;
        let day = this.dueDate.getDate();
        let year = this.dueDate.getFullYear();
        let date = this.formatDate();
        let taskObj = {
          taskId: Date.now(),
          title: this.title,
          text: this.areaValue,
          tag: this.tag,
          createdAt: date,
          dueDate: year + "-" + month + "-" + day,
          users: this.taskUsers(),
        };
        this.$emit("reloadTasks", taskObj);
        const idToken = this.$store.getters["user/getIdToken"];
        const userId = this.$store.getters["user/getUserId"];
        const payload = { task: taskObj, idToken: idToken, userId: userId };
        this.addTask(payload);
        this.title = "";
        this.areaValue = "";
        this.dueDate = "";
        this.selectedUsers = [];
        this.$refs.op.hide();
      }
    },
    formatDate() {
      const timeElapsed = Date.now();
      const today = new Date(timeElapsed);
      return today.toLocaleDateString();
    },
    taskUsers() {
      const parsedList = [];
      this.selectedUsers.forEach((user) => {
        parsedList.push({
          userId: user.code,
          name: user.name,
          email: user.email,
        });
      });

      const userObj = {
        userId: this.$store.getters["user/getUserId"],
        name: this.$store.getters["user/getFullName"],
        email: this.$store.getters["user/getUser"].email,
      };
      parsedList.push(userObj);
      return parsedList;
    },
  },
};
</script>
<style scoped>
p-overlaypanel .p-overlaypanel-content {
  width: 100%;
}
.p-datepicker {
  width: 200px;
  height: 200px;
}
#overlay_panel {
  font-size: 14px;
  justify-content: space-evenly;
}
.p-multiselect {
  width: 16rem;
}
/* @media screen and (max-width: 640px) {
  .p-multiselect {
    width: 100%;
  }
} */
</style>
