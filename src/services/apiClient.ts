/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { parseCookies } from 'nookies';

const getAPICLient = (ctx?: any) => {
  const { authToken } = parseCookies(ctx);
  const api = axios.create({
    baseURL: 'http://localhost:3000/api',
  });

  if (authToken) {
    api.defaults.headers.common.Authorization = `Bearer ${authToken}`;
  }

  return api;
};

export default getAPICLient;
