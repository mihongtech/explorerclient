<template>
  <div class="address">
    <h1>Linkchain Address
      <small>Addresses are identifiers which you use to send linkchains to another person.</small>
    </h1>
    <div class="info">
      <div class="info-cell info-summary">
        <table>
          <tr>
            <th colspan="2">Summary</th>
          </tr>
          <tr>
            <td>Address</td>
            <td>
              <router-link :to="{path: `/address/${address}`}">{{address}}</router-link>
            </td>
          </tr>
        </table>
      </div>
      <div class="info-cell info-transaction">
        <table>
          <tr>
            <th colspan="2">Transactions</th>
          </tr>
          <tr>
            <td>No. Transactions</td>
            <td>{{transactions.length}}</td>
          </tr>
          <tr>
            <td>Total Received</td>
            <td>{{totalReceive}}</td>
          </tr>
          <tr>
            <td>Final Balance</td>
            <td>{{total}}</td>
          </tr>
        </table>
      </div>
    </div>

    <div class="transaction">
      <h1>Transactions</h1>
      <div class="transaction-item">
        <table>
          <tbody v-for="(transaction) in transactions" :key="transaction.tx_id">
          <tr>
            <th colspan="4">
              <router-link :to="`/transaction/${transaction.tx_id}`">{{transaction.tx_id}}</router-link>
            </th>
          </tr>
          <tr>
            <td>
              <div v-if="transaction.from">
                <p v-for="from in transaction.from">
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
              <p v-for="to in transaction.to">
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
              <el-button type="success">{{transaction.toTotal}}</el-button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import {getAddressInfo} from '@/api'

  export default {
    name: "Address",
    data() {
      return {
        transactions: [],
        totalSpend: 0,
        totalReceive: 0,
        total: 0,
        address: '',
      }
    },
    methods: {
      loadAddressInfo(hash) {
        getAddressInfo({hash})
          .then((transactions) => {
            transactions.forEach((transaction) => {
              transaction.toTotal = 0;
              (transaction.to || []).forEach((t) => {
                transaction.toTotal += t.amount;
                if(t.account_id === this.$route.params.hash) {
                  this.totalReceive += t.amount;
                } else {
                  this.totalSpend += t.amount;
                }
              });
            });
            this.total = this.totalReceive - this.totalSpend;
            this.transactions = transactions
          })
      }
    },
    mounted() {
      this.loadAddressInfo(this.$route.params.hash);
    },
    beforeRouteUpdate(to, from, next) {
      this.loadAddressInfo(to.params.hash);
      next()
    }
  }
</script>

<style scoped lang="scss">
  .address {
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

  .info-transaction {
    margin-left: 10px;
  }
</style>
