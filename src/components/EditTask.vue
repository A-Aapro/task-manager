<template>
  <div
    ref="op"
    id="overlay_panel"
    appendTo="body"
    :breakpoints="{ '470px': '90vw' }"
    :style="{ width: '350px' }"
  >
    <form class="block" @submit.prevent="saveTask">
      <div class="mt-0">
        <my-input
          class="block mb-1"
          :required="!title"
          v-model="title"
          type="text"
          maxlength="50"
        />
        <text-area
          class="block mb-1"
          v-model="areaValue"
          :autoResize="false"
          rows="5"
          cols="30"
          maxlength="500"
          :required="!areaValue"
        />
        <div class="w-full flex flex-row flex-wrap mt-3">
          <div class="flex" v-for="user in users" :key="user">
            <my-chip
              :label="user.name"
              :class="colorUserChip(user.userId)"
              class="mt-2 mr-2 flex"
            ></my-chip>
          </div>
        </div>
        <multi-select
          class="mb-1 mt-3"
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

        <div class="mt-2">
          <my-calendar
            id="dateformat"
            :required="!dueDate"
            :minDate="minDateValue"
            :showIcon="true"
            v-model="dueDate"
            dateFormat="dd.mm.yy"
            placeholder="Määräaika"
            :touchUI="true"
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
  </div>
</template>
<script>
import TextArea from "primevue/textarea";
import MyCalendar from "primevue/calendar";
import MultiSelect from "primevue/multiselect";
import Chip from "primevue/chip";

export default {
  components: {
    TextArea,
    MyCalendar,
    MultiSelect,
    "my-chip": Chip,
  },
  data() {
    return {
      taskId: null,
      title: null,
      areaValue: null,
      tag: null,
      userDate: null,
      dueDate: null,
      selectedUsers: [],
      users: null,
      userList: [],
    };
  },
  created() {
    (this.taskId = this.taskData.taskId),
      (this.title = this.taskData.title),
      (this.areaValue = this.taskData.text),
      (this.tag = this.taskData.tag),
      (this.userDate = this.taskData.userDate);
    this.users = this.taskData.users;
    this.dueDate = new Date(this.taskData.dueDate);
  },
  emits: ["hidePanel"],
  props: {
    taskData: {
      type: Object,
    },
  },
  computed: {
    getUsers() {
      const users = this.$store.getters["user/getUsers"];
      users.forEach((user) => {
        let match = this.users.find((taskUser) => {
          if (taskUser.userId === user.userId) {
            return true;
          }
        });
        if (!match && user.userId !== this.$store.getters["user/getUserId"]) {
          let userObj = {
            name: user.firstname + " " + user.lastname,
            code: user.userId,
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
    toggle() {
      this.this.$emit("hidePanel");
    },
    checkForm() {
      if (this.title && this.areaValue && this.tag && this.dueDate) {
        return true;
      }
    },
    saveTask() {
      if (this.checkForm()) {
        let month = this.dueDate.getMonth() + 1;
        let day = this.dueDate.getDate();
        let year = this.dueDate.getFullYear();
        let editedTaskObj = {
          taskId: this.taskId,
          title: this.title,
          text: this.areaValue,
          tag: this.tag,
          userDate: this.formatDate,
          dueDate: year + "-" + month + "-" + day,
          users: [...this.users, ...this.selectedUsers],
        };
        const payload = {
          task: editedTaskObj,
          taskId: this.taskId,
          idToken: this.$store.getters["user/getIdToken"],
          userId: this.$store.getters["user/getUserId"],
        };
        this.$store.dispatch("task/editTask", payload);
        this.title = "";
        this.areaValue = "";
        this.dueDate = "";
        this.selectedUsers = null;
        this.toggle();
      }
    },
    formatDate() {
      const timeElapsed = Date.now();
      const today = new Date(timeElapsed);
      return today.toLocaleDateString();
    },
    colorUserChip(id) {
      if (id === this.$store.getters["user/getUserId"]) {
        return "custom-chip";
      } else {
        return null;
      }
    },
  },
};
</script>
<style>
p-overlaypanel .p-overlaypanel-content {
  width: 100%;
}

#overlay_panel {
  font-size: 14px;
  justify-content: space-evenly;
}
.p-multiselect {
  width: 16rem;
}
.p-chip-text {
  font-size: 10px;
}
.p-chip.custom-chip {
  background: rgb(255, 236, 193);
  color: rgb(48, 48, 48);
}
/* @media screen and (max-width: 640px) {
  .p-multiselect {
    width: 100%;
  }
} */
</style>
