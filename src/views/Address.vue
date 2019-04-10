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
            <td>{{remain}}</td>
          </tr>
        </table>
      </div>
    </div>

    <Transactions :transactions="transactions"/>
  </div>
</template>

<script>
  import {getAddressInfo} from '@/api'
  import Transactions from '@/components/Transactions';

  export default {
    name: "Address",
    components: {
      Transactions,
    },
    data() {
      return {
        transactions: [],
        totalSpend: 0,
        totalReceive: 0,
        remain: 0,
        address: '',
      }
    },
    methods: {
      loadAddressInfo(hash) {
        this.address = hash;
        this.totalSpend = 0;
        this.totalReceive = 0;
        this.remain = 0;
        getAddressInfo({hash})
          .then((transactions) => {
            transactions.forEach((transaction) => {
              transaction.totalFrom = 0; // 当前账户该笔交易总花费
              transaction.totalReceive = 0; // 当前账户该笔交易总收入
              transaction.totalTo = 0; // 交易总账

              transaction.fromAccount = [];
              transaction.toAccount = [];

              (transaction.from || []).forEach((f) => {
                if (f.account_id === this.$route.params.hash) {
                  transaction.totalFrom += f.amount;
                }

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
                transaction.totalTo += t.amount;
                if (t.account_id === this.$route.params.hash) {
                  transaction.totalReceive += t.amount;
                }

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
              if (transaction.totalReceive - transaction.totalFrom > 0) {
                this.totalReceive += transaction.totalReceive - transaction.totalFrom;
              }
              this.remain += transaction.totalReceive - transaction.totalFrom;
            });
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
