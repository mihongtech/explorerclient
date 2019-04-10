<template>
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
            <div v-if="transaction.fromAccount.length">
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
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Transactions",
    props: {
      transactions: Array
    }
  }
</script>

<style scoped>

</style>
