<template>
  <div class="block">
    <h1>Block #{{block.height}}</h1>
    <div class="info">
      <div class="info-summary">
        <table>
          <tr>
            <th colspan="2">Summary</th>
          </tr>
          <tr>
            <td>Number Of Transactions</td>
            <td>{{block.transactions ? block.transactions.length : ''}}</td>
          </tr>
          <tr>
            <td>Output Total</td>
            <td>{{block.output || ''}}</td>
          </tr>
          <!--<tr>
            <td>Estimated Transaction Volume</td>
            <td>{{block.transactions ? block.transactions.length : ''}}</td>
          </tr>-->
          <tr>
            <td>Transaction Fees</td>
            <td>{{block.gasFee}}</td>
          </tr>
          <tr>
            <td>Height</td>
            <td>
              <router-link :to="{path: `/block/${block.hash}`}">{{block.height}}</router-link>
            </td>
          </tr>
          <tr>
            <td>Timestamp</td>
            <td>{{block.time || ''}}</td>
          </tr>
          <tr>
            <td>Received Time</td>
            <td>{{block.time || ''}}</td>
          </tr>
          <tr>
            <td>Difficulty</td>
            <td>{{block.difficulty || ''}}</td>
          </tr>
          <tr>
            <td>Bits</td>
            <td>{{block.hex || ''}}</td>
          </tr>
          <tr>
            <td>Size</td>
            <td>{{block.hex ? `${block.hex/1000}kB` : ''}}</td>
          </tr>
          <tr>
            <td>Version</td>
            <td>{{block.version || ''}}</td>
          </tr>
          <tr>
            <td>Nonce</td>
            <td>{{block.version || ''}}</td>
          </tr>
          <tr>
            <td>Block Reward</td>
            <td>{{block.coinbase || ''}}</td>
          </tr>
        </table>
      </div>
      <div class="info-hashes">
        <table>
          <tr>
            <th colspan="2">Hashes</th>
          </tr>
          <tr>
            <td>Block Hash</td>
            <td>
              <router-link :to="{path: `/block/${block.hash}`}">{{block.hash}}</router-link>
            </td>
          </tr>
          <tr>
            <td>Previous Block</td>
            <td>
              <router-link
                :to="{path: `/block/${block.prev}`}"
                v-if="block.prev!='0000000000000000000000000000000000000000000000000000000000000000'">
                {{block.prev}}
              </router-link>
            </td>
          </tr>
          <tr>
            <td>Next Block</td>
            <td>
              <router-link :to="{path: `/block/${block.next}`}" v-if="block.next">
                {{block.next}}
              </router-link>
            </td>
          </tr>
          <tr>
            <td>Merkle Root</td>
            <td>{{block.txroot || ''}}</td>
          </tr>
        </table>
      </div>
    </div>

    <div class="transaction">
      <h1>Transactions</h1>
      <div class="transaction-item">
        <table>
          <tbody v-for="(transaction) in block.transactions" :key="transaction.tx_id">
          <tr>
            <th colspan="4">
              <router-link to="a">{{transaction.tx_id}}</router-link>
            </th>
          </tr>
          <tr>
            <td>
              <div v-if="transaction.from">
                <p v-for="from in transaction.from">{{from.accountId}}</p>
              </div>
              <div v-else class="coinbase">No Inputs (Newly Generated Coins)</div>
            </td>
            <td>
              <img src="@/assets/arrow_right_green.png"/>
            </td>
            <td>
              <p v-for="to in transaction.to">{{to.accountId}}</p>
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
  import {getBlockByHash} from '@/api'

  export default {
    data() {
      return {
        block: {}
      }
    },
    methods: {
      loadBlock(hash) {
        getBlockByHash({hash})
          .then((block) => {
            block = block || {};
            let fromTotal = 0;
            let toTotal = 0;
            (block.transactions || []).forEach((transaction) => {
              transaction.toTotal = (transaction.to || []).reduce((prev, cur) => prev + cur.amount, 0);
              if (!transaction.from) {
                block.coinbase = (transaction.to || []).reduce((prev, cur) => prev + cur.amount, 0)
              } else {
                fromTotal += (transaction.from || []).reduce((prev, cur) => prev + cur.amount, 0);
                toTotal += transaction.toTotal;
              }
            });
            block.output = block.coinbase + toTotal;
            block.gasFee = fromTotal - toTotal;
            block.time = block.time.replace('T', ' ').replace('Z', '');
            this.block = block
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    mounted() {
      this.loadBlock(this.$route.params.hash);
    },
    beforeRouteUpdate(to, from, next) {
      this.loadBlock(to.params.hash);
      next()
    }
  }
</script>

<style scoped lang="scss">
  .block {
    padding: 100px 20px 20px;
    background: #fff;
    color: rgb(95, 95, 95);
  }
  a {
    color: #10ADE4;
    text-decoration: none;
  }
  .block h1 {
    font-size: 36px;
    font-weight: normal;
  }

  .info {
    display: flex;
  }

  .info-summary {
    margin-right: 10px;
  }

  .info-hashes {
    margin-left: 10px;
  }

  .info-summary,
  .info-hashes {
    flex: 1;

    table {
      border-collapse: collapse;
      width: 100%;
    }

    tr:nth-child(odd) {
      background: #f9f9f9;
    }

    td, th {
      border-bottom: 1px solid #ddd;
      padding: 8px;
      font-size: 12px;
    }

    th {
      text-align: left;
      border-top: 1px solid #ddd;
    }
  }
  .transaction {
    table {
      border-collapse: collapse;
      width: 100%;
    }
    tr {
      border-top: 1px solid #ddd;
    }
    th {
      font-size: 12px;
      text-align: left;
      padding: 8px;
      background: #f9f9f9;
    }
    td {
      vertical-align: top;
      font-size: 14px;
      padding: 8px;
    }
    td:last-child {
      text-align: right;
    }
    tr:last-child {
      border-bottom: 1px solid #ddd;
    }
    img {
      height: 20px;
      vertical-align: middle;
    }
    p {
      margin: 0;
      line-height: 30px;
    }
    .coinbase {
      font-weight: bold;
      color: gray;
    }
  }
</style>
