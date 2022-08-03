<template>
  <div class="grid user-view h-full">
    <!--SIDE NAV-->
    <side-navigator
      @toggle-game="toggleChat"
      @log-out="logOut"
    ></side-navigator>
    <!--SIDE NAV END-->
    <div class="mt-2 lg:ml-4 col-12 lg:col-9 block">
      <!--BUTTON ROW-->
      <div
        class="col-12 flex flex-wrap mb-2 p-2 w-full border-round justify-content-between"
      >
        <add-task @reload-tasks="newTask"></add-task>
        <div class="flex p-1 border-round">
          <my-button
            icon="pi pi-list"
            class="p-button-rounded p-button-text p-button-plain"
            @click="toggleView1"
          />
          <my-button
            icon="pi pi-th-large"
            class="p-button-rounded p-button-text p-button-plain ml-2"
            @click="toggleView2"
          />
        </div>
      </div>
      <!--BUTTON ROW END -->
      <!--TASK GRID-->
      <div
        id="grid-bg"
        class="mt-2 ml-1 col-12 h-30rem border-round overflow-scroll"
      >
        <card-list v-show="showCardList" :passNewTask="newTaskObj"></card-list>
        <task-table v-show="showTaskTable"></task-table>
        <monster-game v-show="showGame"></monster-game>
      </div>
      <!--TASK GRID END-->
    </div>
  </div>
</template>

<script>
import SideNavigator from "@/components/SideNavigator.vue";
import AddNewTask from "@/components/AddNewTask.vue";
import TaskTable from "@/components/TaskTable.vue";
import CardList from "@/components/CardList.vue";
import MonsterGame from "@/components/MonsterSlayer.vue";

export default {
  components: {
    SideNavigator,
    "add-task": AddNewTask,
    TaskTable,
    CardList,
    MonsterGame,
  },
  data() {
    return {
      showCardList: true,
      showTaskTable: false,
      newTaskObj: null,
      showGame: false,
    };
  },
  emits: ["logOut"],
  mounted() {
    const payload = {
      idToken: this.$store.getters["user/getIdToken"],
      userId: this.$store.getters["user/getUserId"],
    };
    this.$store.dispatch("task/getTasks", payload);
  },
  methods: {
    newTask(task) {
      this.newTaskObj = task;
    },
    toggleChat() {
      this.showTaskTable = false;
      this.showCardList = false;
      this.showGame = true;
    },
    toggleView1() {
      this.showGame = false;
      this.showCardList = false;
      this.showTaskTable = true;
    },
    toggleView2() {
      this.showGame = false;
      this.showTaskTable = false;
      this.showCardList = true;
    },
    logOut(newVal) {
      this.$emit("logOut", newVal);
    },
  },
};
</script>

<style>
.user-view {
  /* background-image: url("../assets/board.jpg"); */
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  background-color: var(--surface-ground);
}
#grid-bg {
  background-color: transparent;
}
card-list {
  background: transparent;
}
.task-column {
  padding: 0px 5px 2px 0px;
}

.badge {
  font-size: 10px;
}
.p-panel .p-panel-content {
  padding: 5px;
  border: 1px solid #dee2e6;
  background-color: rgba(225, 225, 225, 0.171);
}

.panel-content {
  min-height: 500px;
}

.p-panel-header {
  font-size: 0.9rem;
  padding: 5px;
}

.p-card .p-card-body {
  padding: 5px 15px 0px 15px;
  margin: 2px;
}

.p-card .p-card-title {
  margin: 0px;
}

.p-card .p-card-content {
  padding: 15px 3px 3px 3px;
}
.p-datatable .p-datatable-tbody > tr > td {
  text-align: left;
  border: 1px solid #e9ecef;
  border-width: 0 0 1px 0;
}

::-webkit-scrollbar {
  width: 0; /* Remove scrollbar space */
  background: transparent; /* Optional: just make scrollbar invisible */
}
/* Optional: show position indicator in red */
::-webkit-scrollbar-thumb {
  background: #f3f3f3;
}
</style>
