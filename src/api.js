import http from '@/utils/http'

export const getBlockList = data => http.post('/block/list', data);

export const getBlockByHash = data => http.post('/block/hash', data);
