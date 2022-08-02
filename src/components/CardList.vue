<template>
  <div class="grid">
    <div class="task-column col-12 lg:col-3">
      <teleport to="body">
        <confirm-dialog />
      </teleport>
      <my-panel header="Normaali" :toggleable="true">
        <template #icons>
          <span class="normal mr-3 mb-3">{{ getListLength(0) }}</span>
        </template>
        <drag-able class="panel-content" v-model="normalList" :key="nKey">
          <template v-slot:item="{ item }">
            <task-card
              :task-id="item.taskId"
              :title="item.title"
              :task-description="item.text"
              :tag="item.tag"
              :createdAt="item.createdAt"
              :due-date="item.dueDate"
              :users="item.users"
              @remove-task="removeTask"
            />
          </template>
        </drag-able>
      </my-panel>
    </div>
    <div class="task-column col-12 lg:col-3">
      <confirm-dialog id="confirm" autofocus />
      <my-panel header="Tärkeä" :toggleable="true">
        <template #icons>
          <span class="urgent mr-3 mb-3">{{ getListLength(1) }}</span>
        </template>
        <drag-able class="panel-content" v-model="urgentList" :key="uKey">
          <template v-slot:item="{ item }">
            <task-card
              :task-id="item.taskId"
              :title="item.title"
              :task-description="item.text"
              :tag="item.tag"
              :createdAt="item.createdAt"
              :due-date="item.dueDate"
              :users="item.users"
              @remove-task="removeTask"
            />
          </template>
        </drag-able>
      </my-panel>
    </div>
    <div class="task-column col-12 lg:col-3">
      <my-panel header="Kesken" :toggleable="true">
        <template #icons>
          <span class="ongoing mr-3 mb-3">{{ getListLength(2) }}</span>
        </template>
        <drag-able class="panel-content" v-model="ongoingList" :key="oKey">
          <template v-slot:item="{ item }">
            <task-card
              :task-id="item.taskId"
              :title="item.title"
              :task-description="item.text"
              :tag="item.tag"
              :createdAt="item.createdAt"
              :due-date="item.dueDate"
              :users="item.users"
              @remove-task="removeTask"
            />
          </template>
        </drag-able>
      </my-panel>
    </div>
    <div class="task-column col-12 lg:col-3">
      <my-panel header="Tehty" :toggleable="true">
        <template #icons>
          <span class="done mr-3">{{ getListLength(3) }}</span>
        </template>
        <drag-able class="panel-content" v-model="doneList" :key="dKey">
          <template v-slot:item="{ item }">
            <task-card
              :task-id="item.taskId"
              :title="item.title"
              :task-description="item.text"
              :tag="item.tag"
              :createdAt="item.createdAt"
              :due-date="item.dueDate"
              :users="item.users"
              @remove-task="removeTask"
            />
          </template>
        </drag-able>
      </my-panel>
    </div>
  </div>
</template>
<script>
import Draggable from "vue3-draggable";
import { mapState } from "vuex";

export default {
  components: {
    "drag-able": Draggable,
  },
  data() {
    return {
      doneList: [],
      urgentList: [],
      ongoingList: [],
      normalList: [],
      uKey: 0,
      oKey: 0,
      dKey: 0,
      nKey: 0,
    };
  },
  props: ["passNewTask"],
  computed: {
    ...mapState("task", ["tasks"]),
  },

  watch: {
    passNewTask() {
      switch (this.passNewTask.tag) {
        case "Tärkeä":
          this.urgentList.push(this.passNewTask);
          this.forceRerender();
          break;
        case "Kesken":
          this.ongoingList.push(this.passNewTask);
          this.forceRerender();
          break;
        case "Tehty":
          this.doneList.push(this.passNewTask);
          this.forceRerender();
          break;
        case "Normaali":
          this.normalList.push(this.passNewTask);
          this.forceRerender();
          break;
        default:
          console.log(`Error at push: ${this.passNewTask}.`);
      }
    },
    tasks() {
      if (this.tasks) {
        this.doneList = this.tasks.filter((task) => task.tag === "Tehty");
        this.urgentList = this.tasks.filter((task) => task.tag === "Tärkeä");
        this.ongoingList = this.tasks.filter((task) => task.tag === "Kesken");
        this.normalList = this.tasks.filter((task) => task.tag === "Normaali");
        this.forceRerender();
      }
    },
    normalList(newVal, oldVal) {
      if (newVal.length != oldVal.length) {
        this.normalList.forEach((item) => (item.tag = "Normaali"));
        this.getListLength(0);
        this.updateNewTask(newVal, oldVal);
      }
    },
    urgentList(newVal, oldVal) {
      if (newVal.length != oldVal.length) {
        this.urgentList.forEach((item) => (item.tag = "Tärkeä"));
        this.getListLength(1);
        this.updateNewTask(newVal, oldVal);
      }
    },
    ongoingList(newVal, oldVal) {
      if (newVal.length != oldVal.length) {
        this.ongoingList.forEach((item) => (item.tag = "Kesken"));
        this.getListLength(2);
        this.updateNewTask(newVal, oldVal);
      }
    },
    doneList(newVal, oldVal) {
      if (newVal.length != oldVal.length) {
        this.doneList.forEach((item) => (item.tag = "Tehty"));
        this.getListLength(3);
        this.updateNewTask(newVal, oldVal);
      }
    },
  },
  methods: {
    updateNewTask(newVal, oldVal) {
      function oldValContains(task) {
        var result = oldVal.find((item) => item.taskId === task.taskId);
        return result;
      }

      if (newVal.length > oldVal.length) {
        newVal.forEach((task) => {
          if (!oldValContains(task)) {
            const payload = {
              task: task,
              taskId: task.taskId,
              idToken: this.$store.getters["user/getIdToken"],
              userId: this.$store.getters["user/getUserId"],
            };
            this.$store.dispatch("task/editTask", payload);
          }
        });
      }
    },
    formatDate(d) {
      return d.toLocaleDateString();
    },
    forceRerender() {
      this.oKey++;
      this.dKey++;
      this.uKey++;
      this.nKey++;
    },
    getListLength(badge) {
      if (badge === 0) {
        return this.normalList.length.toString();
      } else if (badge === 1) {
        return this.urgentList.length.toString();
      } else if (badge === 2) {
        return this.ongoingList.length.toString();
      } else if (badge === 3) {
        return this.doneList.length.toString();
      } else {
        return 0;
      }
    },
    removeTask(id, tag) {
      this.$confirm.require({
        message: "Haluatko poistaa tehtävän?",
        header: "Poista tehtävä",
        icon: "pi pi-info-circle",
        acceptClass: "p-button-danger",
        accept: () => {
          const payload = {
            idToken: this.$store.getters["user/getIdToken"],
            userId: this.$store.getters["user/getUserId"],
            taskId: id,
          };
          this.$store.dispatch("task/deleteTask", payload);
          switch (tag) {
            case "Tärkeä":
              this.urgentList = this.urgentList.filter((t) => t.taskId != id);
              break;
            case "Kesken":
              this.ongoingList = this.ongoingList.filter((t) => t.taskId != id);
              break;
            case "Tehty":
              this.doneList = this.doneList.filter((t) => t.taskId != id);
              break;
            case "Normaali":
              this.normalList = this.normalList.filter((t) => t.taskId != id);
              break;
            default:
              console.log(`Out of ${tag}.`);
          }
          this.forceRerender();
          this.$confirm.close();
        },
        reject: () => {
          this.$confirm.close();
        },
      });
    },
  },
};
</script>

<style scoped>
.task-column {
  padding: 0px 5px 2px 0px;
  background: transparent;
}

.urgent,
.done,
.ongoing,
.normal {
  font-size: 1rem;
}
.p-panel .p-panel-content {
  padding: 5px;
  border: 1px solid #dee2e6;
  background: #ededed50;
}

.panel-content {
  min-height: 500px;
}

.p-panel-header {
  font-size: 13px;
}

.p-card .p-card-body {
  padding: 5px 15px 0px 15px;
  margin: 2px;
}

.p-card .p-card-title {
  font-size: 10px;
  margin: 0px;
}

.p-card .p-card-content {
  padding: 15px 3px 3px 3px;
}
.p-datatable .p-datatable-tbody > tr > td {
  font-size: 10px;
  text-align: left;
  border: 1px solid #e9ecef;
  border-width: 0 0 1px 0;
}

@media only screen and (max-width: 991px) {
  .panel-content {
    min-height: 200px;
  }
}
</style>
