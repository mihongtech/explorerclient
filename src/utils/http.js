import axios from 'axios';
import {Message} from 'element-ui';

const http = axios.create({
  // baseURL: 'http://114.116.18.94',
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.response.use(
  (response) => {
    const {code, message} = response.data;
    if (typeof code === 'undefined') {
      return response.data;
    } else {
      Message.error(message);
      return Promise.reject(message);
    }
  },
  () => {
    const message = 'Server Error';
    Message.error(message);
    return Promise.reject(message);
  },
);

export default http;
