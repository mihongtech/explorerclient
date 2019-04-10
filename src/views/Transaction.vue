<template>
  <div class="transaction">
    <h1>Transaction View
      <small>information about a linkchain transaction</small>
    </h1>
    <table>
      <tr>
        <th colspan="4">
          <router-link :to="`/transaction/${transaction.tx_id}`">{{transaction.tx_id}}</router-link>
        </th>
      </tr>
      <tr>
        <td>
          <div v-if="transaction.from">
            <p v-for="from in transaction.fromAccount">
              <router-link :to="`/address/${from.account_id}`">
                {{from.account_id}}
              </router-link>
            </p>
          </div>
          <div v-else class="coinbase">No Inputs (Newly Generated Coins)</div>
        </td>
        <td>
          <img src="@/assets/arrow_right_green.png"/>
        </td>
        <td>
          <p v-for="to in transaction.toAccount">
            <router-link :to="`/address/${to.account_id}`">
              {{to.account_id}}
            </router-link>
          </p>
        </td>
        <td>
          <p v-for="to in transaction.to">{{to.amount}}</p>
        </td>
      </tr>
      <tr>
        <td colspan="3"></td>
        <td>
          <el-button type="success">{{transaction.totalTo}}</el-button>
        </td>
      </tr>
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
      <div class="info-cell info-money" v-if="transaction.fromAccount.length">
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
  import {getTransactionByHash, getBestBlock} from '@/api'

  export default {
    name: "Transaction",
    data() {
      return {
        transaction: {},
        block: {},
        best: {},
      }
    },
    methods: {
      loadTransaction(hash) {
        getTransactionByHash({hash})
          .then((transaction = {}) => {
            transaction.totalFrom = (transaction.from || []).reduce((prev, cur) => prev + cur.amount, 0);
            transaction.totalTo = (transaction.to || []).reduce((prev, cur) => prev + cur.amount, 0);
            transaction.fromAccount = [];
            transaction.toAccount = [];

            (transaction.from || []).forEach((f) => {
              const fromAccount = transaction.fromAccount.find(fa => fa.account_id === f.account_id);
              if (typeof fromAccount === 'undefined') {
                transaction.fromAccount.push({
                  account_id: f.account_id,
                  tickets: [f]
                });
              } else {
                fromAccount.tickets.push(f);
              }
            });

            (transaction.to || []).forEach((t) => {
              const toAccount = transaction.toAccount.find(ta => ta.account_id === t.account_id);
              if (typeof toAccount === 'undefined') {
                transaction.toAccount.push({
                  account_id: t.account_id,
                  tickets: [t]
                });
              } else {
                toAccount.tickets.push(t);
              }
            });

            this.transaction = transaction;
            this.block = transaction.block;
            this.block.time = this.block.time.replace('T', ' ').replace('Z', '');
          })
          .catch(err => {
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
