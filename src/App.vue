<template>
  <div id="app">
    <el-container>
      <el-header height="80px">
        <a href="/" class="logo">LINKCHAIN</a>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
      <el-footer>
        <p>© mihongtech.com | <a href="http://github.com/etherparty/explorer">Fork me on GitHub</a></p>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
  import HelloWorld from './components/HelloWorld.vue'

  export default {
    name: 'app',
    components: {
      HelloWorld
    },
    data() {
      return {
        num: 5
      }
    },
    mounted() {
      setTimeout(() => {
        this.num = 100
      }, 1000)
    }
  }
</script>
