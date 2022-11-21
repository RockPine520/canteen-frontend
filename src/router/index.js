import {createRouter, createWebHistory} from 'vue-router'
import Employee from '../views/Employee.vue'
import Layout from "@/layout/Layout";
import Login from "@/views/Login";
import Sign from "@/views/Sign";
import Device from "@/views/Device";

const routes = [
    {
        path: '/',
        name: 'Layout',
        component: Layout,
        redirect:"/employee",
        children: [
            {
                path: '/employee',
                name: 'Employee',
                component: Employee,
            },
            {
                path: '/sign',
                name: 'sign',
                component: Sign
            },
            {
                path: '/device',
                name: 'device',
                component: Device
            },
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },

]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
