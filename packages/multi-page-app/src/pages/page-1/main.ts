import { createApp } from "vue";
import App from "@/common/components/App.vue";
import router from "./router";
import "./index.scss";
import "vant/lib/index.css";
import "vant/es/dialog/style";
import { Button } from "vant";
console.log(import.meta.env.VITE_BASE_URL);

const app = createApp(App);
app.use(router);
app.use(Button);
app.mount("#app");
