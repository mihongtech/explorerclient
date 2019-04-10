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
        <div class="ticket" v-for="from in fmtTransaction.fromAccounts">
          <router-link :to="`/address/${from.account_id}`">
            {{from.account_id}}
          </router-link>
          <el-popover placement="right" trigger="click" title="Tickets">
            <el-table :data="from.tickets" size="mini"
                      :height="Math.min(from.tickets.length + 1, 5) * 36">
              <el-table-column width="500" label="Transaction">
                <template slot-scope="scope">
                  <router-link :to="{path: `/transaction/${scope.row.tx_id}`}">
                    {{scope.row.tx_id}}
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column width="100" align="center" property="index" label="Index"/>
              <el-table-column width="200" align="center" property="amount" label="Amount"/>
            </el-table>
            <el-button type="success" size="mini" circle icon="el-icon-tickets" slot="reference"/>
          </el-popover>
        </div>
      </div>
      <div v-else class="coinbase">No Inputs (Newly Generated Coins)</div>
    </td>
    <td>
      <img src="@/assets/arrow_right_green.png"/>
    </td>
    <td>
      <div class="ticket" v-for="to in fmtTransaction.toAccounts">
        <router-link :to="`/address/${to.account_id}`">
          {{to.account_id}}
        </router-link>
      </div>
    </td>
    <td>
      <p v-for="to in fmtTransaction.toAccounts">{{to.amount}}</p>
    </td>
  </tr>
  <tr>
    <td colspan="3"></td>
    <td>
      <el-button
        :type="address ? (fmtTransaction.receive - fmtTransaction.spend > 0 ? 'success' : 'danger') : 'success'">
        {{address ? fmtTransaction.receive - fmtTransaction.spend : fmtTransaction.totalTo}}
      </el-button>
    </td>
  </tr>
  </tbody>
</template>

<script>
  export default {
    props: {
      transaction: Object,
      address: {
        type: Boolean,
        value: false
      }
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
