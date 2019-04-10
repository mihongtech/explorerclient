<template>
  <div class="transaction">
    <h1>Transaction View
      <small>information about a linkchain transaction</small>
    </h1>
    <table>
      <Transaction :transaction="transaction"/>
    </table>

    <div class="info">
      <div class="info-cell info-summary">
        <table>
          <tr>
            <th colspan="2">Summary</th>
          </tr>
          <tr>
            <td>Received Time</td>
            <td>{{block.time}}</td>
          </tr>
          <tr>
            <td>Included In Blocks</td>
            <td>
              <router-link :to="{path: `/block/${block.hash}`}">
                {{block.height}}
              </router-link>
              ({{block.time}})
            </td>
          </tr>
          <tr>
            <td>Confirmations</td>
            <td>{{best.height - block.height + 1}}</td>
          </tr>
        </table>
      </div>
      <div class="info-cell info-money" v-if="transaction.from && transaction.from.length">
        <table>
          <tr>
            <th colspan="2">Inputs and Outputs</th>
          </tr>
          <tr>
            <td>Total Input</td>
            <td>{{transaction.totalFrom}}</td>
          </tr>
          <tr>
            <td>Total Output</td>
            <td>{{transaction.totalTo}}</td>
          </tr>
          <tr>
            <td>Fees</td>
            <td>{{transaction.totalFrom - transaction.totalTo}}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import {getTransactionByHash, getBestBlock} from '@/api';
  import Transaction from '@/components/Transaction';

  export default {
    components: {
      Transaction,
    },
    data() {
      return {
        transaction: {},
        block: {},
        best: {},
      }
    },
    methods: {
      loadTransaction(hash) {
        const loading = this.$loading({
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        getTransactionByHash({hash})
          .then((transaction = {}) => {
            transaction.totalFrom = (transaction.from || []).reduce((prev, cur) => prev + cur.amount, 0);
            transaction.totalTo = (transaction.to || []).reduce((prev, cur) => prev + cur.amount, 0);
            this.transaction = transaction;
            this.block = transaction.block;
            this.block.time = this.block.time.replace('T', ' ').replace('Z', '');
            loading.close();
          })
          .catch(err => {
            loading.close();
          })
      },
      loadBestBlock() {
        getBestBlock()
          .then((block = {}) => {
            this.best = block;
          })
      }
    },
    mounted() {
      this.loadBestBlock();
      this.loadTransaction(this.$route.params.hash)
    },
    beforeRouteUpdate(to, from, next) {
      this.loadTransaction(to.params.hash);
      next()
    }
  }
</script>

<style scoped lang="scss">
  .transaction {
    padding: 100px 20px 20px;
    background: #fff;
    color: rgb(95, 95, 95);
  }

  a {
    color: #10ADE4;
    text-decoration: none;
  }

  small {
    font-weight: normal;
  }

  .info {
    display: flex;
    margin-top: 40px;
  }

  .info-summary {
    margin-right: 10px;
  }

  .info-money {
    margin-left: 10px;
  }
</style>
