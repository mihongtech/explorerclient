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
            <td>Final Balance</td>
            <td>{{final}}</td>
          </tr>
        </table>
      </div>
    </div>

    <div class="transaction">
      <h1>Transactions</h1>
      <div class="transaction-item">
        <table>
          <Transaction v-for="transaction in transactions" :transaction="transaction" address/>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import {getAddressInfo} from '@/api'
  import Transaction from '@/components/Transaction';

  export default {
    components: {
      Transaction,
    },
    data() {
      return {
        transactions: [],
        final: 0,
        address: '',
        page: 1,
        size: 20,
        total: 0,
      }
    },
    methods: {
      loadAddressInfo(hash, page) {
        this.address = hash;
        this.final = 0;
        const loading = this.$loading({
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        getAddressInfo({hash, page})
          .then(({list, page, total, final}) => {
            this.total = total;
            this.page = page;
            this.final = final;
            list.forEach((transaction) => {
              transaction.spend = 0; // 当前账户该笔交易总花费
              transaction.receive = 0; // 当前账户该笔交易总收入

              (transaction.from || []).forEach((f) => {
                if (f.account_id === this.$route.params.hash) {
                  transaction.spend += f.amount;
                }
              });

              (transaction.to || []).forEach((t) => {
                if (t.account_id === this.$route.params.hash) {
                  transaction.receive += t.amount;
                }
              });
            });
            this.transactions = list;
            loading.close();
          })
          .catch(() => {
            loading.close();
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
