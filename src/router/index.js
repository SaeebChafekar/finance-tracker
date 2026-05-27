import { createRouter, createWebHistory } from 'vue-router'
import Dashboard     from '../views/Dashboard.vue'
import Transactions  from '../views/Transactions.vue'
import Subscriptions from '../views/Subscriptions.vue'
import Analytics     from '../views/Analytics.vue'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',               component: Dashboard     },
    { path: '/transactions',   component: Transactions  },
    { path: '/subscriptions',  component: Subscriptions },
    { path: '/analytics',      component: Analytics     },
  ]
})