import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from "../components/Login/Login";
import Welcome from "../components/Welcome";
import Params from "../views/Params/Params";
import Reports from "../views/Reports/Reports";
import Categories from "../views/Categories/Categories";
import Orders from "../views/Orders/Orders";
import Rights from "../views/Rights/Rights";
import Roles from "../views/Roles/Roles";
import Users from "../views/Users/Users";
import Goods from "../views/Goods/Goods";
import addGoods from "../views/Goods/addGoods";

  Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:'/login'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect:'/welcome',
    children:[
      {
        path: '/welcome',
        name: 'Welcome',
        component: Welcome,
      },
      {
        path: '/params',
        name: 'Params',
        component: Params,
      },{
        path: '/reports',
        name: 'Reports',
        component: Reports,
      },{
        path: '/categories',
        name: 'Categories',
        component: Categories,
      },{
        path: '/orders',
        name: 'Orders',
        component: Orders,
      },{
        path: '/rights',
        name: 'Rights',
        component: Rights,
      },{
        path: '/roles',
        name: 'Roles',
        component: Roles,
      },{
        path: '/users',
        name: 'Users',
        component: Users,
      }, {
        path: '/goods',
        name: 'Goods',
        component: Goods,
      }, {
        path: '/goods/addgoods',
        name: 'addGoods',
        component: addGoods,
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = new VueRouter({
  routes
})
//为路由设置导航守卫
router.beforeEach((to,from,next)=>{
  if(to.path=='/login') return next()
  const sessionStr=window.sessionStorage.getItem('token')
  if(!sessionStr) return next('/login')
  next()
})
export default router
