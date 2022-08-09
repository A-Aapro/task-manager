<template>
  <div class="ml-0">
    <data-table
      :value="tasks"
      v-model:selection="selectedTask"
      selectionMode="single"
      dataKey="taskId"
      v-model:expandedRows="expandedRows"
      responsiveLayout="stack"
      breakpoint="992px"
      class="border-round"
    >
      <data-column :expander="true" headerStyle="width: 2rem" />
      <data-column field="title" header="Otsikko" sortable></data-column>
      <data-column field="dueDate" header="Määräaika" sortable> </data-column>
      <data-column field="tag" header="Tekijät" sortable>
        <template #body="slotProps">
          <div class="chip-container mt-2 flex flex-row flex-wrap w-full">
            <template v-for="user in slotProps.data.users" :key="user">
              <a class="mailto" :href="sendEmail(user.email)"
                >.<my-avatar
                  :label="user.name.charAt(0)"
                  class="mb-1 mr-1"
                  size="small"
                  :style="styleAvatar(user.userId)"
                  shape="circle"
                  v-tooltip.top="user.email"
              /></a>
            </template>
          </div>
        </template>
      </data-column>
      <data-column field="tag" header="Status" sortable>
        <template #body="slotProps">
          <div class="status" :class="colorTags(slotProps.data)">
            {{ slotProps.data.tag }}
          </div>
        </template>
      </data-column>
      <template #expansion="slotProps">
        <div class="list-content">
          <p>{{ slotProps.data.text }}</p>
          <p class="text-xs mt-3">Luotu: {{ slotProps.data.createdAt }}</p>
        </div>
      </template>
    </data-table>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      selectedTask: null,
      expandedRows: [],
    };
  },

  methods: {
    colorTags(data) {
      return [
        {
          urgent: data.tag === "Tärkeä",
          ongoing: data.tag === "Kesken",
          done: data.tag === "Tehty",
          normal: data.tag === "Normaali",
        },
      ];
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
      let userStr = user || "2149879615";
      let hsl = hslColor(userStr);
      let colorStr = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
      return "background-color: " + colorStr + "; " + "color: #ffffff";
    },
    sendEmail(email) {
      return "mailto:" + email;
    },
  },
  computed: {
    ...mapState("task", ["tasks"]),
  },
};
</script>

<style scoped>
.list-content {
  padding-left: 60px;
  font-size: 15px;
}
p {
  margin: 5px;
}
a {
  color: transparent;
}
#due-date {
  font-size: 1rem;
}
.status {
  width: 5rem;
  padding: 0.2rem;
  text-align: center;
  font-weight: bolder;
  font-size: 0.9rem;
  color: rgb(255, 255, 255);
  border-radius: 2px;
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
.p-avatar {
  font-size: 15px;
  width: 1.5rem;
  height: 1.5rem;
}

@media screen and (max-width: 992px) {
  * {
    font-size: 13px;
  }
  .p-datatable {
    width: 80vw;
    margin: auto;
    padding: 0;
  }
  .list-content {
    padding-left: 5px;
    font-size: 15px;
  }
  .chip-container {
    justify-content: end;
  }

  .status {
    width: 4rem;
    padding: 0.2rem;
    text-align: center;
    font-weight: bolder;
    font-size: 0.8rem;
    color: rgb(255, 255, 255);
    border-radius: 2px;
  }
  .p-avatar {
    font-size: 12px;
    width: 1.3rem;
    height: 1.3rem;
  }
  ::v-deep(td) {
    padding: 5px 10px !important;
  }
}
</style>
