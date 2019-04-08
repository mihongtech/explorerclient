<template>
  <div class="home">
    <div class="block">
      <div class="block-head">
        <a href="javascript:;">BLOCKS</a>
      </div>
      <div class="block-body" v-loading="loading">
        <el-table :data="data" stripe style="width: 100%">
          <el-table-column align="center" prop="height" label="Height">
            <template slot-scope="scope">
              <router-link :to="{path: `/block/${scope.row.hash}`}">{{scope.row.height}}</router-link>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Age">
            <template slot-scope="scope">
              <timeago :datetime="scope.row.time" :auto-update="60" :converter-options="{addSuffix: false}"/>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="txs" label="Transactions"/>
          <el-table-column align="center" prop="hex" label="Size (bytes)"/>
        </el-table>
        <el-pagination
          background
          :page-size="10"
          :total="total"
          :current-page="page"
          @current-change="loadBlockList"
          layout="prev, pager, next, total"/>
      </div>
    </div>
  </div>
</template>

<script>
  import {getBlockList} from '@/api'

  export default {
    name: 'home',
    data() {
      return {
        page: 1,
        size: 10,
        data: [],
        total: 0,
        loading: true
      }
    },
    methods: {
      loadBlockList(page) {
        this.loading = true;
        getBlockList({page, size: this.size})
          .then(res => {
            this.data = res.list || [];
            this.total = res.total;
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          })
      }
    },
    mounted() {
      this.loadBlockList(1);
    }
  }
</script>

<style scoped>
  .home {
    padding: 100px 20px 20px;
  }

  .block {
    background: #fff;
    padding: 20px;
  }

  .block-head {
    padding-bottom: 10px;
  }

  .block-head a {
    display: inline-block;
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    color: rgb(97, 159, 247);
    background: rgb(236, 245, 254);
    text-decoration: none;
  }

  /deep/ .el-table th.is-leaf,
  /deep/ .el-table td {
    border-bottom: none;
  }

  /deep/ .el-table--striped .el-table__body tr:nth-child(odd) td {
    background: rgb(240, 242, 247);
  }

  /deep/ .el-table--striped .el-table__body tr:nth-child(even) td {
    background: rgb(255, 255, 255);
  }

  /deep/ .el-table .cell {
    line-height: 40px;
  }

  /deep/ .el-table::before {
    content: none;
  }

  /deep/ .cell a {
    color: rgb(61, 137, 245);
    text-decoration: none;
  }

  /deep/ .el-pagination {
    text-align: right;
  }
</style>
