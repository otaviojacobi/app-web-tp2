import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/Home.vue';
import Race from '../components/Race.vue';
import Login from '../components/Login.vue';

Vue.use(Router)

export default new Router({
    routes: [
       {path: '/', component: Home},
       {path: '/race', component: Race},
       {path: '/login', component: Login},

    ]
})