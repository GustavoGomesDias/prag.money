/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks, MockResponse, RequestMethod } from 'node-mocks-http';
import withProtect, { GetUserAuthInfoRequest } from '../../../../serverless/api/middlewares/withProtect';
import UserDAOImp from '../../../../serverless/DAOImp/users/UserDAOImp';
import JWTService from '../../../../serverless/services/JWTService';

describe('Auth middleare test', () => {
  const mockRequestResponse = (method: RequestMethod = 'GET') => {
    const { req, res }: { req: GetUserAuthInfoRequest, res: NextApiResponse } = createMocks({ method });

    req.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    return { req, res };
  };

  const mockAPIEndPointFunction = async (req: NextApiRequest, res: NextApiResponse) => res.status(200).json({ message: 'ok' });

  test('Should return 401 if authorization is undefined', async () => {
    const { req, res } = mockRequestResponse('POST');

    const response = await withProtect(mockAPIEndPointFunction)(req, res) as unknown as MockResponse<NextApiResponse>;

    expect(response.statusCode).toEqual(401);
    // eslint-disable-next-line no-underscore-dangle
    expect(response._getJSONData()).toEqual({ error: 'Por favor, faça login para ter acesso!' });
  });

  test('Should return 401 if authorization is undefined', async () => {
    const { req, res } = mockRequestResponse('POST');

    req.headers.authorization = undefined;

    const response = await withProtect(mockAPIEndPointFunction)(req, res) as unknown as MockResponse<NextApiResponse>;

    expect(response.statusCode).toEqual(401);
    // eslint-disable-next-line no-underscore-dangle
    expect(response._getJSONData()).toEqual({ error: 'Por favor, faça login para ter acesso!' });
  });

  test('Should return 404 if user in token not exists', async () => {
    const { req, res } = mockRequestResponse('POST');

    req.headers.authorization = 'Bearer abc';
    // jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());
    jest.spyOn(JWTService.prototype, 'verify').mockImplementationOnce((token: string) => ({
      id: 1,
      name: 'name',
      email: 'email@email.com',
    }));

    jest.spyOn(UserDAOImp.prototype, 'findUnique').mockImplementationOnce(async (data) => {
      const result = await Promise.resolve(undefined);

      return result;
    });
    const response = await withProtect(mockAPIEndPointFunction)(req, res) as unknown as MockResponse<NextApiResponse>;
    expect(response.statusCode).toEqual(404);
    // eslint-disable-next-line no-underscore-dangle
    expect(response._getJSONData()).toEqual({ error: 'Usuário cadastrado neste Token aparenta não existir.' });
  });

  test('Should return 404 if authorization header is empty', async () => {
    const { req, res } = mockRequestResponse('POST');

    req.headers.authorization = '';
    const response = await withProtect(mockAPIEndPointFunction)(req, res) as unknown as MockResponse<NextApiResponse>;
    expect(response.statusCode).toEqual(401);
    // eslint-disable-next-line no-underscore-dangle
    expect(response._getJSONData()).toEqual({ error: 'Por favor, faça login para ter acesso!' });
  });
});
