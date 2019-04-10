<template>
  <tbody>
  <tr>
    <th colspan="4">
      <router-link :to="`/transaction/${fmtTransaction.tx_id}`">{{fmtTransaction.tx_id}}</router-link>
    </th>
  </tr>
  <tr>
    <td>
      <div v-if="fmtTransaction.fromAccounts && fmtTransaction.fromAccounts.length">
        <p v-for="from in fmtTransaction.fromAccounts">
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
      <p v-for="to in fmtTransaction.toAccounts">
        <router-link :to="`/address/${to.account_id}`">
          {{to.account_id}}
        </router-link>
      </p>
    </td>
    <td>
      <p v-for="to in fmtTransaction.toAccounts">{{to.amount}}</p>
    </td>
  </tr>
  <tr>
    <td colspan="3"></td>
    <td>
      <el-button type="success">{{fmtTransaction.totalTo}}</el-button>
    </td>
  </tr>
  </tbody>
</template>

<script>
  export default {
    name: "Transactions",
    props: {
      transaction: Object,
    },
    methods: {
      combineTickets(tickets) {
        const accounts = [];
        (tickets || []).forEach((t) => {
          const account = accounts.find(a => a.account_id === t.account_id);
          if (typeof account === 'undefined') {
            accounts.push({
              account_id: t.account_id,
              tickets: [t],
              amount: t.amount,
            });
          } else {
            account.tickets.push(t);
            account.amount += t.amount;
          }
        });
        return accounts;
      }
    },
    computed: {
      fmtTransaction() {
        const fmtTransaction = {...this.transaction};
        fmtTransaction.fromAccounts = this.combineTickets(fmtTransaction.from);
        fmtTransaction.toAccounts = this.combineTickets(fmtTransaction.to);
        return fmtTransaction;
      }
    }
  }
</script>

<style scoped>

</style>
