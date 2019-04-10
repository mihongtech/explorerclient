import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Block from '@/views/Block'
import Transaction from '@/views/Transaction'
import Address from '@/views/Address'

Vue.use(Router);

export default new Router({
  scrollBehavior: () => ({x: 0, y: 0}),
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/block/:hash',
      component: Block,
    },
    {
      path: '/transaction/:hash',
      component: Transaction,
    },
    {
      path: '/address/:hash',
      component: Address,
    }
  ]
})
