<template>
  <overlay-panel ref="op"
    ><edit-card :task-data="taskData" @hide-panel="toggle"
  /></overlay-panel>
  <my-card
    class="border-200 mb-2 pb-0 cursor-move"
    @mouseover="hovered = true"
    @mouseleave="hovered = false"
    :class="{ 'shadow-5': hovered }"
  >
    <template #title>
      <div class="flex justify-content-end align-content-center">
        <my-button
          icon="pi pi-pencil"
          class="buttons p-button-rounded p-button-text p-button-secondary p-0"
          @click="toggle"
        />
        <my-button
          icon="pi pi-trash"
          class="buttons p-button-rounded p-button-text p-button-secondary p-0"
          @click="$emit('removeTask', taskId, tag)"
        />
        <div
          class="align-self-center flex align-items-center justify-content-center"
        >
          <my-chip id="flag" class="mt-1 ml-3" :class="fillFlag" />
        </div>
      </div>
      <p class="text-sm flex text-sm m-0 overflow-auto">{{ title }}</p>
    </template>
    <template #content>
      <p class="text-sm m-0 mb-3 p-0 max-h-5rem overflow-auto">
        {{ taskDescription }}
      </p>
      <template v-for="user in users" :key="user">
        <my-chip
          :label="user.name"
          :class="colorUserChip(user.userId)"
          class="user-chip h-auto mt-2 mr-2"
        />
      </template>
      <p class="text-xs mt-3">Määräaika: {{ dueDateParsed }}</p>
      <p class="text-xs mt-3 mb-3">Luotu: {{ createdAt }}</p>
    </template>
  </my-card>
</template>

<script>
import Card from "primevue/card";
import Chip from "primevue/chip";
import EditTask from "./EditTask.vue";
import OverlayPanel from "primevue/overlaypanel";

export default {
  components: {
    "my-card": Card,
    "my-chip": Chip,
    "edit-card": EditTask,
    OverlayPanel,
  },
  data() {
    return {
      hovered: false,
      data: null,
    };
  },
  emits: ["removeTask"],
  props: {
    taskId: {
      type: Number,
    },
    title: {
      type: String,
    },
    taskDescription: {
      type: String,
    },
    tag: {
      type: String,
    },
    createdAt: {
      type: String,
    },
    dueDate: {
      type: String,
    },
    users: {
      type: Array,
    },
  },

  computed: {
    taskData() {
      const data = {
        taskId: this.taskId,
        title: this.title,
        text: this.taskDescription,
        tag: this.tag,
        createdAt: this.createdAt,
        dueDate: this.dueDate,
        users: this.users,
      };
      return data;
    },
    dueDateParsed() {
      const d = new Date(this.dueDate);
      return d.getDate() + "." + d.getMonth() + "." + d.getFullYear();
    },
    fillFlag() {
      if (this.tag === "Tärkeä") {
        return "urgent";
      } else if (this.tag === "Kesken") {
        return "ongoing";
      } else if (this.tag === "Tehty") {
        return "done";
      } else if (this.tag === "Normaali") {
        return "normal";
      } else {
        return "chip";
      }
    },
  },
  methods: {
    toggle(event) {
      this.$refs.op.toggle(event);
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
<style scoped>
.buttons {
  font-size: 1rem;
  margin-top: 5px;
  margin-right: 3px;
}
.user-chip {
  font-size: 0.7rem;
  height: 20px;
}
#flag {
  width: 0.6rem;
  height: 1rem;
}

.normal {
  background-color: rgb(109, 194, 209);
}
.urgent {
  background-color: rgb(255, 91, 91);
}
.ongoing {
  background-color: rgb(245, 199, 75);
}
.done {
  background-color: rgb(90, 201, 86);
}
.p-chip.custom-chip {
  background: rgb(141, 238, 214);
  color: rgb(48, 48, 48);
}
</style>
