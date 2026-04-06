import { createRouter, createWebHistory } from "vue-router";

import Dashboard from "../views/Dashboard.vue";
import Analytics from "../views/Analytics.vue";
import Subscriptions from "../views/Subscriptions.vue";
import Transactions from "../views/Transactions.vue";

const routes = [
  { path: '/', component: Dashboard },
  { path: '/analytics', component: Analytics },
  { path: '/subscriptions', component: Subscriptions },
  { path: '/transactions', component: Transactions },
]

export default createRouter({
  // history: createWebHistory('/finance-tracker/'),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})