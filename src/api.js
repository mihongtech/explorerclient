import http from '@/utils/http'

export const getBestBlock = data => http.post('/block/best', data);

export const getBlockList = data => http.post('/block/list', data);

export const getBlockByHash = data => http.post('/block/hash', data);

export const getTransactionByHash = data => http.post('/transaction/hash', data);

export const getAddressInfo = data => http.post('/address/hash', data);
