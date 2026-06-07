import { createRouter, createWebHistory } from 'vue-router';
import AdminLayout from '../layouts/AdminLayout.vue';
import Login from '../views/Login.vue';
import Catalog from '../views/Catalog.vue';
import BasicLayout from "@/layouts/BasicLayout.vue";
import {storageService} from "@/utils/storage.js";
import Delegates from "@/views/Delegates.vue";
import Sites from "@/views/Sites.vue";
import Teams from "@/views/Teams.vue";
import Pecs from "@/views/Pecs.vue";
import TeamMembers from "@/views/TeamMembers.vue";
import Patients from "@/views/Patients.vue";
import Idels from "@/views/Idels.vue";

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/',
        component: BasicLayout,
        children: [
            { path: 'login', component: Login }
        ]
    },
    {
        path: '/login',
        redirect: '/login'
    },
    {
        path: '/auth',
        component: AdminLayout,
        meta: { requiresAuth: true },
        children: [
            { path: 'catalog', component: Catalog },
            { path: 'delegates', component: Delegates },
            { path: 'sites', component: Sites },
            { path: 'teams', component: Teams },
            { path: 'pecs', component: Pecs },
            { path: 'teams/:tid', name:'members', component: TeamMembers, props: true },
            { path: 'patients', component: Patients },
            { path: 'idels', component: Idels },

        ]
    },
    { path: "/:catchAll(.*)", redirect: "/login" },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {

    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    const isAuthenticated =  storageService.getItem('admin')  !== null;

    if (requiresAuth && !isAuthenticated) {
        next('/login');
    } else {
        next();
    }
});

export const goTo = (path) => {
    router.push(path);
}

export default router;