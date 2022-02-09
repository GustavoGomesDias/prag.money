import { NextApiRequest, NextApiResponse } from 'next';
import handlerRegister from '../../../pages/api/register';
import { EmailValidatorAdapter } from '../../../serverless/adapters/EmailValidatorAdapter';
import UserController, { HttpResponse } from '../../../serverless/api/controllers/User';

const makeEmailValidator = (): EmailValidatorAdapter => {
  class EmailValidatorStub implements EmailValidatorAdapter {
    isEmail(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
}

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

    const emailValidator = makeEmailValidator();
    const userController = new UserController(emailValidator);

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

    const emailValidator = makeEmailValidator();
    const userController = new UserController(emailValidator);

    const httpResponse: HttpResponse = userController.handleRegister(httpRequest);

    expect(httpResponse).toEqual({
      statusCode: 400,
      message: 'E-mail requerido.',
    })
  });

  test('Should return 400 if no password is provided', () => {
    const httpRequest = {
      body: {
        user: {
          name: 'name',
          email: 'email@email.com',
          password: '',
          passwordConfirmation: 'password',
        }
      },
    };

    const emailValidator = makeEmailValidator();
    const userController = new UserController(emailValidator);

    const httpResponse: HttpResponse = userController.handleRegister(httpRequest);

    expect(httpResponse).toEqual({
      statusCode: 400,
      message: 'Senha requerida.',
    })
  });

  test('Should return 400 if no password is provided', () => {
    const httpRequest = {
      body: {
        user: {
          name: 'name',
          email: 'email@email.com',
          password: 'password',
          passwordConfirmation: '',
        }
      },
    };

    const emailValidator = makeEmailValidator();
    const userController = new UserController(emailValidator);

    const httpResponse: HttpResponse = userController.handleRegister(httpRequest);

    expect(httpResponse).toEqual({
      statusCode: 400,
      message: 'Confirmação de senha requerida.',
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

    const emailValidator = makeEmailValidator();
    jest.spyOn(emailValidator, 'isEmail').mockReturnValueOnce(false);
    const userController = new UserController(emailValidator);

    const httpResponse: HttpResponse = userController.handleRegister(httpRequest);

    expect(httpResponse).toEqual({
      statusCode: 400,
      message: 'E-mail inválido.',
    })
  });
});