import { NextApiRequest, NextApiResponse } from 'next';
import handlerRegister from '../../../pages/api/register';
import UserController, { HttpResponse } from '../../../serverless/controllers/User';

describe('Handle Register test', () => {
  test('Should return 400 if no name is provided', () => {
    const httpRequest = {
      body: {
        user: {
          name: '',
          email: 'email@email.com',
          password: 'password',
          passwordConfirmation: 'password',
        }
      },
    };
    const userController = new UserController();

    const httpResponse: HttpResponse = userController.handleRegister(httpRequest);

    expect(httpResponse).toEqual({
      statusCode: 400,
      message: 'Nome requerido.',
    })
  });
  
  test('Should return 400 if no email is provided', () => {
    const httpRequest = {
      body: {
        user: {
          name: 'name',
          email: '',
          password: 'password',
          passwordConfirmation: 'password',
        }
      },
    };
    const userController = new UserController();

    const httpResponse: HttpResponse = userController.handleRegister(httpRequest);

    expect(httpResponse).toEqual({
      statusCode: 400,
      message: 'E-mail requerido.',
    })
  });
  test('Should return 400 if email is not valid', () => {
    const httpRequest = {
      body: {
        user: {
          name: 'name',
          email: 'invalid_email2email,com',
          password: 'password',
          passwordConfirmation: 'password',
        }
      },
    };
    const userController = new UserController();

    const httpResponse: HttpResponse = userController.handleRegister(httpRequest);

    expect(httpResponse).toEqual({
      statusCode: 400,
      message: 'E-mail inválido.',
    })
  });
});