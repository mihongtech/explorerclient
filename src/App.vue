<template>
  <div id="app">
    <el-container>
      <el-header height="80px">
        <a href="/" class="logo">LINKCHAIN</a>
        <el-input
          class="header-search"
          v-model="keyword"
          @keyup.enter.native="doSearch"
          placeholder="Address, transaction hash, block height or hash"
          prefix-icon="el-icon-search"/>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
      <el-footer>
        <p>© mihongtech.com | <a href="https://github.com/xixisese/linkchain" target="_blank">Fork me on GitHub</a></p>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
  import {getByKeyword} from '@/api';

  export default {
    data() {
      return {
        keyword: '',
      }
    },
    methods: {
      doSearch() {
        const keyword = this.keyword.trim();
        this.keyword = keyword;
        if (!keyword) return;
        getByKeyword({keyword})
          .then((res) => {
            const {path, param} = res;
            if (path === 'null') {
              this.$alert(
                'Oops! We couldn\'t find what you are looking for. Please enter an address, transaction hash, block height or hash',
                {
                  confirmButtonText: 'OK',
                  callback: action => {
                  }
                });
            } else {
              this.$router.push({path: `/${path}/${param}`});
            }
          })
          .catch(() => {
          })
      }
    },
    mounted() {
    }
  }
</script>

<style scoped>
  .el-header {
    justify-content: space-between;
  }

  .header-search {
    width: 300px;
  }

  /deep/ .el-input__inner {
    color: #fff;
    border-radius: 30px;
    background: transparent;
  }
</style>
