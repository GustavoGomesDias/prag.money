import { HttpResponse } from '../../serverless/api/helpers/http';
import FetchAPI from './FetchAPI';

const createAPI = (): FetchAPI<HttpResponse> => {
  if (process.env.NODE_ENV === 'production') {
    return new FetchAPI('https://pragmoney.woood.dev/api');
  }

  return new FetchAPI('http://localhost:3000/api');
};

const api = createAPI();

export default api;
