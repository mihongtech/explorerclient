import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Block from '@/views/Block'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/block/:hash',
      component: Block,
    }
  ]
})
