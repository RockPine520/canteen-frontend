import {createRouter, createWebHistory} from 'vue-router'
import Employee from '../views/Employee.vue'
import Layout from "@/layout/Layout";
import Login from "@/views/Login";
import Sign from "@/views/Sign";
import Device from "@/views/Device";
import EmpGroup from "@/views/EmpGroup";
import EmpType from "@/views/EmpType";

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
            {
                path: '/empgroup',
                name: 'empgroup',
                component: EmpGroup
            },
            {
                path: '/emptype',
                name:'emptype',
                component: EmpType
            }
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
