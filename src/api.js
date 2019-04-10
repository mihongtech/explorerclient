import http from '@/utils/http'

export const getBestBlock = data => http.post('/rpc/block/best', data);

export const getBlockList = data => http.post('/rpc/block/list', data);

export const getBlockByHash = data => http.post('/rpc/block/hash', data);

export const getTransactionByHash = data => http.post('/rpc/transaction/hash', data);

export const getAddressInfo = data => http.post('/rpc/address/hash', data);

export const getByKeyword = data => http.post('/rpc/search/global', data);
