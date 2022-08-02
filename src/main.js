import { createApp } from "vue";
import App from "./App.vue";
import PrimeFlex from "primeflex/primeflex.css";
import PrimeVue from "primevue/config";
import TaskCard from "./components/TaskCard.vue";
import router from "@/router";
import Button from "primevue/button";
import RadioButton from "primevue/radiobutton";
import InputText from "primevue/inputtext";
import Badge from "primevue/badge";
import ConfirmationService from "primevue/confirmationservice";
import ConfirmDialog from "primevue/confirmdialog";
import Panel from "primevue/panel";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup"; //optional for column grouping
import Row from "primevue/row"; //optional for row
import Avatar from "primevue/avatar";
import store from "@/store/modules/index.js";
import Tooltip from "primevue/tooltip";

import "primevue/resources/primevue.css"; // core css
import "primeicons/primeicons.css"; // icons

//import 'primevue/resources/themes/fluent-light/theme.css' //theme
import "primevue/resources/themes/vela-green/theme.css";

const app = createApp(App);
// app.config.globalProperties.window = window;
app.use(store);
app.use(PrimeVue, { ripple: true });
app.use(PrimeFlex);
app.use(router);
app.use(ConfirmationService);
app.component("my-button", Button);
app.component("my-input", InputText);
app.component("task-card", TaskCard);
app.component("radio-button", RadioButton);
app.component("my-badge", Badge);
app.component("confirm-dialog", ConfirmDialog);
app.component("my-panel", Panel);
app.component("data-table", DataTable);
app.component("data-row", Row);
app.component("data-column", Column);
app.component("column-group", ColumnGroup);
app.component("my-avatar", Avatar);
app.directive("tooltip", Tooltip);
app.mount("#app");
