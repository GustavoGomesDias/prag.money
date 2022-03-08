import FetchAPI from './FetchAPI';

const createAPI = <T>(): FetchAPI<T> => {
  if (process.env.NODE_ENV === 'production') {
    return new FetchAPI('https://pragmoney.vercel.app/api');
  }

  return new FetchAPI('http://localhost:3000/api');
};

export default createAPI;
