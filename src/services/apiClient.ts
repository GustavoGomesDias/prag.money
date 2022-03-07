/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from 'axios';
import { parseCookies } from 'nookies';

const createAPI = (): AxiosInstance => {
  if (process.env.NODE_ENV === 'production') {
    return axios.create({
      baseURL: 'https://pragmoney.vercel.app/api',
    });
  }

  return axios.create({
    baseURL: 'http://localhost:3000/api',
  });
};

const getAPICLient = (ctx?: any) => {
  const { authToken } = parseCookies(ctx);

  const api = createAPI();

  if (authToken) {
    api.defaults.headers.common.Authorization = `Bearer ${authToken}`;
  }

  return api;
};

export default getAPICLient;
