import VueRouter from "vue-router";
import Vue from "vue";
import Login from "@/components/Login";
import Home from "@/components/Home";
import AdminHome from "@/components/AdminHome";
import UserOrder from "@/components/UserOrder";
import UserTransport from "@/components/UserTransport";
import UserCart from "@/components/UserCart";
import UserMapDetail from '@/components/UserMapDetail';
// import Main from '@/components/Main';
import UserBar from '@/components/UserBar';
Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    component:UserBar,
    children: [
      // {//商城页
      //   path: '/main',
      //   name: 'Main',
      //   component: Main
      // },
      { //登录页
        path: '/login',
        name: 'Login',
        component: Login
      },
      { //用户首页
        path: '/home',
        name: 'Home',
        component: Home
      },
      { //商家首页
        path: '/adminhome',
        name: 'AdminHome',
        component: AdminHome
      },
      { //用户查看订单页
        path: '/userorder',
        name: 'UserOrder',
        component: UserOrder
      },
      { //用户查看运单页
        path: '/usertransport',
        name: 'UserTransport',
        component: UserTransport
      },
      { //用户查看购物车
        path: '/usercart',
        name: 'UserCart',
        component: UserCart
      },
      { //用户查看物流
        path: '/usermapdetail',
        name: 'UserMapDetail',
        component: UserMapDetail
      }
    ]
  },
  // {//商城页
  //   path: '/main',
  //   name: 'Main',
  //   component: Main
  // },
  { //登录页
    path: '/login',
    name: 'Login',
    component: Login
  },
  { //用户首页
    path: '/home',
    name: 'Home',
    component: Home
  },
  { //商家首页
    path: '/adminhome',
    name: 'AdminHome',
    component: AdminHome
  },
  { //用户查看订单页
    path: '/userorder',
    name: 'UserOrder',
    component: UserOrder
  },
  { //用户查看运单页
    path: '/usertransport',
    name: 'UserTransport',
    component: UserTransport
  },
  { //用户查看购物车
    path: '/usercart',
    name: 'UserCart',
    component: UserCart
  },
  { //用户查看物流
    path: '/usermapdetail',
    name: 'UserMapDetail',
    component: UserMapDetail
  }
]

const router = new VueRouter({
  routes
})

export default router
